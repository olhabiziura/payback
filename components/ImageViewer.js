import { Image } from 'react-native';
import styles from '../assets/styles/MainContainer';

export default function ImageViewer({ placeholderImageSource, size }) {
    if (size ==="small"){
    return (
        <Image source={placeholderImageSource} style={styles.imageSmall} />
    );
    }
    if (size ==="big")
    {
        return (
            <Image source={placeholderImageSource} style={styles.imageBig} />
        );
        }
}
