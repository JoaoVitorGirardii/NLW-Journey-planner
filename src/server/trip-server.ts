import { err } from "react-native-svg"
import { API } from "./api"

export type TripDetails = {
    id: string,
    destination: string,
    starts_at: string,
    ends_at: string,
    is_confirmed: boolean
}

type TripCreate = Omit<TripDetails,'id'| 'is_confirmed'> & {
    emails_to_invite: string[]
}

async function getById(id: string){
    try{
        const { data } = await API.get<{trip: TripDetails}>(`/trips/${id}`)
        return data.trip
    }catch(error){
        throw error
    }
}

async function create({ destination, starts_at, ends_at, emails_to_invite }: TripCreate){
    try {
        const { data } = await API.post<{tripId: string}>("/trips", {
            destination,
            starts_at,
            ends_at,
            emails_to_invite,
            owner_name: "João vitor girardi",
            owner_email: "joao.vitor.girardii@gmail.com"
        })
        return data
    } catch (error) {
        throw error
    }
}

async function update({ id, destination, ends_at, starts_at }: Omit<TripDetails, 'is_confirmed'>){
    try {
        await API.put(`/trips/${id}`,{
            destination,
            starts_at,
            ends_at
        })
    } catch (error) {
        throw error
    }
}

export const tripServer = { getById, create, update }