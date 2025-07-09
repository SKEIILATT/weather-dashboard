import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

interface LocationDisplayProps {
    label: string | null;
    timestamp: string;
}

const LocationDisplay = ({ label, timestamp }: LocationDisplayProps) => {
    if (!label){
        return null;
    } 

    return (
        <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent:'center',
            gap: '8px', 
            padding: '12px',
            borderRadius: '8px',
            marginTop: '12px',
            backdropFilter: 'blur(5px)',
            
        }}>
            <AddLocationAltOutlinedIcon 
                sx={{ 
                    color: '#fff', 
                    fontSize: '20px' 
                }}
            />
            <span style={{ fontWeight: 'bold', color: '#fff' }}>{label}</span>
            <AccessTimeOutlinedIcon 
                sx={{ 
                    color: '#fff', 
                    fontSize: '18px',
                    marginLeft: '12px' 
                }}
            />
            <span style={{ color: '#fff', fontSize: '14px' }}>{timestamp}</span>
        </div>
    );
};

export default LocationDisplay;
