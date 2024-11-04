import { Box } from '@mui/material';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import ModelCard from './ModelCard';

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

interface TrainingModel {
  id: string;
  name: string;
  progress: number;
  eta: string;
  status: 'training' | 'paused' | 'completed' | 'failed';
  type: string;
}

export default function TrainingSection() {
  // Example data
  const trainingModels: TrainingModel[] = [
    {
      id: '1',
      name: 'GPT-Fine-tune-1',
      progress: 75,
      eta: '2h 15m',
      status: 'training',
      type: 'Language Model'
    }
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Carousel
        responsive={responsive}
        infinite={false}
        keyBoardControl={true}
        customTransition="transform 300ms ease-in-out"
        containerClass="carousel-container"
        removeArrowOnDeviceType={["tablet", "mobile"]}
      >
        {trainingModels.map((model) => (
          <Box key={model.id} sx={{ p: 1 }}>
            <ModelCard model={model} type="training" />
          </Box>
        ))}
      </Carousel>
    </Box>
  );
}
