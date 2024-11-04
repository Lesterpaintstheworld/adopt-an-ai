import { Box } from '@mui/material';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import GPUCard from './GPUCard';

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

interface GPU {
  id: string;
  name: string;
  memory: number;
  usage: number;
  temperature: number;
  power: number;
  status: 'active' | 'idle' | 'offline';
}

export default function MyComputeSection() {
  // Example data - replace with real data from your backend
  const myGPUs: GPU[] = [
    {
      id: '1',
      name: 'NVIDIA A100',
      memory: 80,
      usage: 75,
      temperature: 65,
      power: 85,
      status: 'active'
    },
    {
      id: '2',
      name: 'NVIDIA V100',
      memory: 32,
      usage: 45,
      temperature: 55,
      power: 65,
      status: 'idle'
    },
    {
      id: '3',
      name: 'NVIDIA A6000',
      memory: 48,
      usage: 0,
      temperature: 35,
      power: 15,
      status: 'offline'
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
        {myGPUs.map((gpu) => (
          <Box key={gpu.id} sx={{ p: 1 }}>
            <GPUCard gpu={gpu} owned={true} />
          </Box>
        ))}
      </Carousel>
    </Box>
  );
}
