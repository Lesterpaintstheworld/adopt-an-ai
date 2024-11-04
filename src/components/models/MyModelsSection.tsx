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

interface MyModel {
  id: string;
  name: string;
  type: string;
  lastUsed: string;
  performance: number;
  size: string;
}

export default function MyModelsSection() {
  // Example data
  const myModels: MyModel[] = [
    {
      id: '1',
      name: 'Custom-GPT-1',
      type: 'Language Model',
      lastUsed: '2h ago',
      performance: 85,
      size: '1.2GB'
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
        {myModels.map((model) => (
          <Box key={model.id} sx={{ p: 1 }}>
            <ModelCard model={model} type="owned" />
          </Box>
        ))}
      </Carousel>
    </Box>
  );
}
