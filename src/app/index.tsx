import { Input } from "@/components/input"
import { View, Text, Image, Keyboard, Alert } from "react-native"
import { MapPin, Calendar as IconCalendar, Settings2, UserRoundPlus, ArrowRight, AtSign } from "lucide-react-native"
import { colors } from "@/styles/colors"
import { Button } from "@/components/button"
import { useEffect, useState } from "react"
import { Modal } from "@/components/modal"
import { Calendar } from "@/components/calendar"
import { calendarUtils, DatesSelected } from "@/utils/calendarUtils"
import { DateData } from "react-native-calendars"
import dayjs from "dayjs"
import { GuestEmail } from "@/components/email"
import { validateInput } from "@/utils/validateInput"
import { tripStorage } from "@/storage/trip"
import { router } from "expo-router"
import { tripServer } from "@/server/trip-server"
import { Loading } from "@/components/loading"

enum StepForm {
    TRIP_DETAILD = 1,
    ADD_EMAIL = 2
}

enum MODAL {
    NONE = 0,
    CALENDAR = 1,
    GUESTS = 2
}

export default function Index() {

    const [isCreatingTrip, setIsCreatingTrip] = useState(false)
    const [selectedDates, setSelectedDates] = useState({} as DatesSelected)
    const [stepForm, setStepForm] = useState<StepForm>(StepForm.TRIP_DETAILD)
    const [destination, setDestination] = useState<string>("")
    const [showModal, setShowModal] = useState<MODAL>(MODAL.NONE)
    const [emailToInvite, setEmailToInvite] = useState("")
    const [emailsToInvite, setEmailsToInvite] = useState<string[]>([])
    const [isGettingTrip, setIsGettingTrip] = useState(true)

    function handleNextStepForm() {
        if(destination.trim().length === 0 || !selectedDates.startsAt || !selectedDates.endsAt){
            return Alert.alert(
                "Detalhes da viagem",
                "Preencha todas as informações da viagem para seguir."
            )
        }

        if(destination.length < 4){
            return Alert.alert(
                "Detalhes da viagem",
                "O destino deve ter pelo menos 4 caracteres"
            )
        }

        if(stepForm === StepForm.TRIP_DETAILD) {
            return setStepForm(StepForm.ADD_EMAIL)
        }

        Alert.alert("Nova viagem", "Confirmar viagem?", [
            {
                text: "Não",
                style: "cancel"
            },
            {
                text: "Sim", 
                onPress: createTrip
            }
        ])
    }

    function handleSelectedDate(selectedDay: DateData) {
        const dates = calendarUtils.orderStartsAtAndEndsAt({
            startsAt: selectedDates.startsAt,
            endsAt: selectedDates.endsAt,
            selectedDay
        })

        setSelectedDates(dates)

    }

    function handleRemoveEmail(emailToRemove: string){
        setEmailsToInvite(prevState => prevState.filter(email => email !== emailToRemove))
    }

    function handleAddEmail() {
        const emailAlreadyExists = emailsToInvite.find(email => email === emailToInvite)

        if (!validateInput.email(emailToInvite)) return Alert.alert("Convidado", "E-mail inválido.")
        if(emailAlreadyExists) return Alert.alert("Convidado", "E-mail já foi adicionado!")

        setEmailsToInvite(prevState => [...prevState, emailToInvite])
        setEmailToInvite("")
        
    }

    async function saveTrip(tripId: string){
        try {
            await tripStorage.save(tripId)
            router.navigate("/trip/"+tripId)
        } catch (error) {
            Alert.alert("Salvar viagem", "Não foi possível salvar o id da viagem no dispositivo")
            console.log(error)
        }
    }

    async function createTrip(){
        try {
            
            setIsCreatingTrip(true)

            const newTrip = await tripServer.create({
                destination,
                starts_at: dayjs(selectedDates.startsAt?.dateString).toString(),
                ends_at: dayjs(selectedDates.endsAt?.dateString).toString(),
                emails_to_invite: emailsToInvite
            })

            Alert.alert("Nova viagem", "Viagem criada com sucesso!", [
                {
                    text: "OK. Continuar.",
                    onPress: () => saveTrip(newTrip.tripId)
                }
            ])

        } catch (error) {
            console.log(error)
            setIsCreatingTrip(false)
        }
    }

    async function getTrip() {
        try {
            const tripId = await tripStorage.get()

            if(!tripId) {
                return setIsGettingTrip(false)
            }

            const trip = await tripServer.getById(tripId)

            if(trip){
                return router.navigate("/trip/" + trip.id)
            }

        } catch (error) {
            setIsGettingTrip(false)
        }
    }

    useEffect(() => {
        getTrip()
    },[])

    if (isGettingTrip) {
        return <Loading/>
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
                    <Input.Field 
                        placeholder="Para aonde?" 
                        editable={ stepForm === StepForm.TRIP_DETAILD }
                        onChangeText={setDestination}
                        value={destination}
                    />
                </Input>
                
                <Input>
                    <IconCalendar color={colors.zinc[400]} size={20}/>
                    <Input.Field 
                        placeholder="Quando?" 
                        editable={
                            stepForm === StepForm.TRIP_DETAILD
                        }
                        onFocus={() => Keyboard.dismiss()}
                        showSoftInputOnFocus={false}
                        onPressIn={() => stepForm === StepForm.TRIP_DETAILD && setShowModal(MODAL.CALENDAR)}
                        value={selectedDates.formatDatesInText}
                    />
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
                            <Input.Field placeholder="Quem estará na viagem?"
                                autoCorrect={false}
                                value={emailsToInvite.length > 0 
                                    ? `${emailsToInvite.length} pessoa(as) convidada(s)`
                                    : ""
                                }
                                onPressIn={() => {
                                    Keyboard.dismiss()
                                    setShowModal(MODAL.GUESTS)
                                }}
                                showSoftInputOnFocus={false}
                            />
                        </Input>
                    </>
                )}

                <Button 
                    onPress={handleNextStepForm}
                    isLoading={isCreatingTrip}
                >
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

            <Modal 
                title="Selecionar datas" 
                subtitle="Selecione a data de ida e volta da viagem"
                visible={showModal === MODAL.CALENDAR}
                onClose={() => setShowModal(MODAL.NONE)}
            > 
                <View className="gap-4 mt-4">
                    <Calendar 
                        onDayPress={handleSelectedDate}
                        markedDates={selectedDates.dates}
                        minDate={dayjs().toISOString()}
                    />
                    <Button onPress={() => setShowModal(MODAL.NONE)}>
                        <Button.Title>Confirmar</Button.Title>
                    </Button>
                </View>
            </Modal>
            
            <Modal 
                title="Selecionar convidados" 
                subtitle="Os convidados irão receber e-mails para confirmar a participação na viagem."
                visible={showModal === MODAL.GUESTS}
                onClose={() => setShowModal(MODAL.NONE)}
            > 
                <View className="my-2 flex-wrap gap-2 border-b border-zinc-800 py-5 items-start">
                    {emailsToInvite.length > 0 
                        ?  emailsToInvite.map(email => <GuestEmail 
                            key={email} 
                            email={email} 
                            onRemove={() => handleRemoveEmail(email)}/>)

                        : <Text className="text-zinc-600 text-base font-regular">Nenhum e-mail adicionado</Text>
                    }
                    
                </View>
                
                <View>
                    <Input variant="secondary">
                        <AtSign color={colors.zinc[400]} size={20}/>
                        <Input.Field 
                            placeholder="Digite o e-mail do convidado"
                            keyboardType="email-address"
                            onChangeText={setEmailToInvite}
                            value={emailToInvite}
                            returnKeyType="send"
                            onSubmitEditing={handleAddEmail}
                        >
                        </Input.Field>
                    </Input>
                    <Button onPress={handleAddEmail}>
                        <Button.Title>Convidar</Button.Title>
                    </Button>
                </View>
            </Modal>
        </View>
    )
}