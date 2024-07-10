import { ActivityIndicator } from 'react-native'

export function Loading(){
    return <ActivityIndicator
        className='flex-1 items-center justify-center text-lime-300 bg-zinc-950'
    />
}