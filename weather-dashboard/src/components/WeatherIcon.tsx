import React from 'react';
import {
  WbSunny,
  WbCloudy,
  Cloud,
  Foggy,
  Grain,
  Umbrella,
  WaterDrop,
  AcUnit,
  Thunderstorm,
  Help
} from '@mui/icons-material';

interface WeatherIconProps {
  iconName: string;
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ iconName, size = 'medium', color = 'white' }) => {
  const iconProps = {
    fontSize: size,
    sx: { color: color }
  };

  const iconMap: { [key: string]: React.ReactElement } = {
    'WbSunny': <WbSunny {...iconProps} />,
    'PartlyCloudyDay': <WbCloudy {...iconProps} />,
    'Cloud': <Cloud {...iconProps} />,
    'Foggy': <Foggy {...iconProps} />,
    'Grain': <Grain {...iconProps} />,
    'LightMode': <Umbrella {...iconProps} />,
    'WaterDrop': <WaterDrop {...iconProps} />,
    'AcUnit': <AcUnit {...iconProps} />,
    'Thunderstorm': <Thunderstorm {...iconProps} />,
    'Help': <Help {...iconProps} />
  };

  return iconMap[iconName] || <Help {...iconProps} />;
};

export default WeatherIcon;
