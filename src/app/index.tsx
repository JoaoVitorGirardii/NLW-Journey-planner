import { Input } from "@/components/input"
import { View, Text, Image } from "react-native"
import { MapPin, Calendar as IconCalendar, Settings2, UserRoundPlus, ArrowRight } from "lucide-react-native"
import { colors } from "@/styles/colors"
import { Button } from "@/components/button"
import { useState } from "react"

enum StepForm {
    TRIP_DETAILD = 1,
    ADD_EMAIL = 2
}

export default function Index() {

    const [stepForm, setStepForm] = useState<StepForm>(StepForm.TRIP_DETAILD)

    function handleNextStepForm() {
        if(stepForm === StepForm.TRIP_DETAILD) {
            return setStepForm(StepForm.ADD_EMAIL)
        }
    }

    return(
        <View className="flex-1 items-center justify-center px-5">
            <Image  source={require("@/assets/logo.png")} className="h-8" resizeMode="contain"/>
            <Image  source={require("@/assets/bg.png")} className="absolute"/>
            <Text className="text-zinc-400 font-regular text-center text-lg mt-3">
                Convide seus amios e planeje sua {"\n"} primeira viagem
            </Text>
            <View className="w-full bg-zinc-900 p-4 rounded-xl my-8 border border-zinc-800">
                
                <Input>
                    <MapPin color={colors.zinc[400]} size={20}/>
                    <Input.Field placeholder="Para aonde?" editable={
                        stepForm === StepForm.TRIP_DETAILD
                    }/>
                </Input>
                
                <Input>
                    <IconCalendar color={colors.zinc[400]} size={20}/>
                    <Input.Field placeholder="Quando?" editable={
                        stepForm === StepForm.TRIP_DETAILD
                    }/>
                </Input>

                { stepForm === StepForm.ADD_EMAIL && (
                    <>
                        <View className="border-b py-3 border-zinc-800">
                            <Button 
                                variant="secondary" 
                                onPress={() => setStepForm(StepForm.TRIP_DETAILD)}
                            >
                                <Button.Title>Alterar local/data</Button.Title>
                                <Settings2 color={colors.zinc[200]} size={20}/>
                            </Button>
                        </View>

                        <Input>
                            <UserRoundPlus color={colors.zinc[400]} size={20}/>
                            <Input.Field placeholder="Quem estará na viagem?"/>
                        </Input>
                    </>
                )}

                <Button onPress={handleNextStepForm}>
                    <Button.Title>
                        {stepForm === StepForm.TRIP_DETAILD
                            ? "Continuar"
                            : "Confirmar Viagem"
                        }
                    </Button.Title>
                    <ArrowRight color={colors.lime[950]} size={20}/>
                </Button>
            </View>
            <Text className="text-zinc-500 font-regular text-center text-bases">
                Ao planejar sua viajem com o plenn.er você automaticamente concorda com nossos 
                <Text className="text-zinc-300 underline"> termos de uso e políticas de privacidade </Text>
            </Text>
        </View>
    )
}