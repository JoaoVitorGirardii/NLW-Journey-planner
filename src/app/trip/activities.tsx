import { Text, View } from "react-native";
import { TripData } from "./[id]";

type Props = {
    tripDetail: TripData
}

export function TripActivities({ tripDetail }: Props) {
    return <View className="flex-1">
        <Text className="text-white">{tripDetail.destination}</Text>
    </View>
}