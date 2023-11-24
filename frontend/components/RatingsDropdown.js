import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Entypo } from "@expo/vector-icons";

export const RatingsDropdown = ({ onRatingSelect }) => {

    const renderStars = (rating) => {
        return Array.from({ length: rating }, (_, i) => (
            <Entypo key={i} name="star" style={styles.star} />
        ));
    };

    return (
        <View style={styles.container}>
            {[1, 2, 3, 4, 5].map((rating) => (
                <TouchableOpacity
                    key={rating}
                    style={styles.starsRow}
                    onPress={() => onRatingSelect(rating)}
                >
                    {renderStars(rating)}
                </TouchableOpacity>
            ))}
        </View>
        )
    }

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    starsRow: {
        flexDirection: 'row',
        padding: 5,
    },
    star: {
        color: 'black',
        margin: 2,
    },
})

