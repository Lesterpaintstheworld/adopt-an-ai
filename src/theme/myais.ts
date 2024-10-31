interface MyAIsTheme {
  spacing: {
    resourceBar: {
      height: number;
      padding: number;
    };
    entityList: {
      width: string;
      itemHeight: number;
      padding: number;
      gap: number;
    };
    panel: {
      padding: number;
    };
  };
  colors: {
    resources: {
      compute: string;
      energy: string;
      knowledge: string;
    };
    progress: {
      background: string;
      fill: string;
    };
    entity: {
      selected: string;
      hover: string;
      border: string;
    };
    progressBar: {
      background: string;
      fill: string;
    };
    entityProgress: {
      background: string;
      fill: string;
    };
  };
}

// Theme constants for My AIs page
export const MYAIS_THEME: MyAIsTheme = {
  spacing: {
    resourceBar: {
      height: 64,
      padding: 16,
    },
    entityList: {
      width: '100%',
      itemHeight: 72,
      padding: 16,
      gap: 8
    },
    panel: {
      padding: 16,
    }
  },
  colors: {
    resources: {
      compute: '#4CAF50',  // Green
      energy: '#2196F3',   // Blue
      knowledge: '#9C27B0' // Purple
    },
    progress: {
      background: 'rgba(255, 255, 255, 0.12)',
      fill: 'rgba(255, 255, 255, 0.8)'
    },
    entity: {
      selected: 'rgba(255, 255, 255, 0.08)',
      hover: 'rgba(255, 255, 255, 0.04)',
      border: 'rgba(255, 255, 255, 0.12)'
    },
    progressBar: {
      background: 'rgba(255, 255, 255, 0.12)',
      fill: 'rgba(255, 255, 255, 0.8)'
    },
    entityProgress: {
      background: 'rgba(255, 255, 255, 0.12)',
      fill: 'rgba(255, 255, 255, 0.8)'
    }
  }
};
