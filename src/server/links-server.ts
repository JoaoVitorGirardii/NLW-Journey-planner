import { API } from "./api"

export type Link = {
  id: string
  title: string
  url: string
}

type LinkCreate = Omit<Link, "id"> & {
  tripId: string
}

async function getLinksByTripId(tripId: string) {
  try {
    const { data } = await API.get<{ links: Link[] }>(`/trips/${tripId}/links`)
    return data.links
  } catch (error) {
    throw error
  }
}

async function create({ tripId, title, url }: LinkCreate) {
  try {
    const { data } = await API.post<{ linkId: string }>(
      `/trips/${tripId}/links`,
      { title, url }
    )

    return data
  } catch (error) {
    throw error
  }
}

export const linksServer = { getLinksByTripId, create }
