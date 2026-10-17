import axios from 'axios'
import { user } from '../data/user'
import { Goal, Tag, Transaction, User } from './types'

export const API_ROOT = 'https://fencer-commbank.azurewebsites.net'


export async function getUser(): Promise<User | null> {
  try {
    const response = await axios.get(`${API_ROOT}/api/User/${user.id}`)
    return response.data
  } catch (error: any) {
    return null
  }
}

export async function getTransactions(): Promise<Transaction[] | null> {
  try {
    const response = await axios.get(`${API_ROOT}/api/Transaction/User/${user.id}`)
    return response.data
  } catch (error: any) {
    return null
  }
}

export async function getGoals(): Promise<Goal[] | null> {
  try {
    const response = await axios.get(`${API_ROOT}/api/Goal/User/${user.id}`)
    return response.data
  } catch (error: any) {
    return null
  }
}

export async function createGoal(): Promise<Goal | null> {
  try {
    const response = await axios.post(`${API_ROOT}/api/Goal`, {
      userId: user.id,
      targetDate: new Date(),
    })
    return response.data
  } catch (error: any) {
    return null
  }
}

const tagCache = new Map<string, Tag>()
const inFlightTags = new Map<string, Promise<Tag>>()

export async function getTag(tagId: string): Promise<Tag | null> {
  const cached = tagCache.get(tagId)
  if (cached !== undefined) return cached

  const inFlight = inFlightTags.get(tagId)
  if (inFlight !== undefined) return await inFlight

  try {
    const promise = axios.get(`${API_ROOT}/api/Tag/${tagId}`).then((response) => {
      const tag: Tag = response.data
      tagCache.set(tagId, tag)
      inFlightTags.delete(tagId)
      return tag
    })
    inFlightTags.set(tagId, promise)
    return await promise
  } catch (error: any) {
    inFlightTags.delete(tagId)
    return null
  }
}

export async function updateGoal(goalId: string, updatedGoal: Goal): Promise<boolean> {
  try {
    await axios.put(`${API_ROOT}/api/Goal/${goalId}`, updatedGoal)
    return true
  } catch (error: any) {
    return false
  }
}
