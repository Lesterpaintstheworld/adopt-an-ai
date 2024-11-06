import subprocess
import re
import sys

def run_build():
    """Run npm run build and capture output"""
    try:
        npm_path = "..\\node_modules\\.bin\\npm.cmd"  # Pour Windows
        result = subprocess.run([npm_path, 'run', 'build'], 
                              capture_output=True, 
                              text=True,
                              cwd="..")  # Exécuter dans le répertoire parent
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
        aider_path = "..\\venv\\Scripts\\aider.exe"  # Pour Windows
        cmd = [aider_path, '--yes-always', '--message', f'Please fix this error: {error_message}']
        subprocess.run(cmd, check=True, cwd="..")  # Exécuter dans le répertoire parent
    except subprocess.CalledProcessError as e:
        print(f"Error running aider: {e}")
        return False
    return True

def main():
    print("Running build...")
    stdout, stderr = run_build()
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
