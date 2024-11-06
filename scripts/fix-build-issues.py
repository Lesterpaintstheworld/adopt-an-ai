import subprocess
import re
import sys

def check_available_scripts():
    """Check what npm scripts are available"""
    try:
        result = subprocess.run(['npm', 'run'], 
                              capture_output=True, 
                              text=True,
                              cwd="..",
                              shell=True)
        print("Available scripts:")
        print(result.stdout)
        return "build" in result.stdout
    except Exception as e:
        print(f"Error checking available scripts: {e}")
        return False

def check_dependencies(is_backend=False):
    """Check and install dependencies if needed"""
    try:
        cwd = "../backend" if is_backend else ".."
        print(f"Checking {'backend' if is_backend else 'frontend'} dependencies in {cwd}...")
        
        # Vérifier si package.json existe
        result = subprocess.run(['npm', 'list'], 
                              capture_output=True, 
                              text=True,
                              cwd=cwd,
                              shell=True)
        
        if "ERR!" in result.stderr:
            print(f"Installing {'backend' if is_backend else 'frontend'} dependencies...")
            install = subprocess.run(['npm', 'install'], 
                                   capture_output=True, 
                                   text=True,
                                   cwd=cwd,
                                   shell=True)
            if install.returncode != 0:
                print(f"Error installing {'backend' if is_backend else 'frontend'} dependencies:")
                print(install.stderr)
                return False
            print(f"{'Backend' if is_backend else 'Frontend'} dependencies installed successfully")
        return True
    except Exception as e:
        print(f"Error checking {'backend' if is_backend else 'frontend'} dependencies: {e}")
        return False

def run_build():
    """Run npm run build and capture output"""
    try:
        # Check both frontend and backend dependencies
        if not check_dependencies(is_backend=False):
            return "", "Failed to install frontend dependencies"
        if not check_dependencies(is_backend=True):
            return "", "Failed to install backend dependencies"
            
        # Vérifier si le script build existe
        if not check_available_scripts():
            return "", "Build script not found in package.json"
            
        print("Running build command in frontend directory...")
        # Run the build command in the frontend directory
        result = subprocess.run(['npm', 'run', 'build'], 
                              capture_output=True, 
                              text=True,
                              cwd="..",
                              shell=True)
        return result.stdout, result.stderr
    except subprocess.CalledProcessError as e:
        return e.stdout, e.stderr

def extract_errors(build_output):
    """Extract error messages from build output"""
    # Pattern to match TypeScript errors
    error_pattern = r'(?:error TS\d+:|Error:)(.*?)(?=(?:error TS\d+:|Error:)|$)'
    errors = re.finditer(error_pattern, build_output, re.DOTALL)
    return [error.group(1).strip() for error in errors]

def fix_error(error_message):
    """Use aider to fix an error"""
    try:
        result = subprocess.run(['aider', '--yes-always', '--message', f'Please fix this error: {error_message}'],
                              check=True,
                              cwd="..",  # Exécuter dans le répertoire parent
                              shell=True)  # Ajouter shell=True pour Windows
    except subprocess.CalledProcessError as e:
        print(f"Error running aider: {e}")
        return False
    return True

def main():
    print("Running build...")
    stdout, stderr = run_build()
    
    if stderr == "Failed to install frontend dependencies" or stderr == "Failed to install backend dependencies":
        print("Please ensure npm is installed and try again")
        return
        
    if stderr == "Build script not found in package.json":
        print("The build script is not defined in package.json")
        return
        
    build_output = stdout + stderr
    
    if "Successfully" in build_output:
        print("Build successful! No errors to fix.")
        return
    
    errors = extract_errors(build_output)
    
    if not errors:
        print("No specific errors found in build output.")
        print("Build output:", build_output)
        return
    
    print(f"Found {len(errors)} errors to fix.")
    
    for i, error in enumerate(errors, 1):
        print(f"\nFixing error {i}/{len(errors)}:")
        print(error)
        if fix_error(error):
            print(f"Attempted to fix error {i}")
        else:
            print(f"Failed to fix error {i}")
    
    print("\nAll errors processed. Running final build...")
    final_stdout, final_stderr = run_build()
    if "Successfully" in (final_stdout + final_stderr):
        print("Final build successful!")
    else:
        print("Some errors may remain. Please check the build output.")

if __name__ == "__main__":
    main()
