import { channelsSelector } from '@/store/slices/channels'
import { NomalizedChannel } from '@/types/Channel'
import { useEffect, useState } from 'react'
import { useAppSelector } from './useReduxHooks'

export const useChannelLabel = () => {
  const { getStatus, resource } = useAppSelector(channelsSelector)
  const [channelsInfo, setChannelsInfo] = useState<NomalizedChannel[]>([])

  const getChannelLabel = (channelId: number) => {
    if (getStatus === 'resolved') {
      const channel = channelsInfo.filter((ch) => ch.id === channelId)
      if (channel.length) {
        return channel[0].label
      }
    }
    return ''
  }

  const channelsLabels = () => {
    if (getStatus === 'resolved') {
      return channelsInfo.map((e) => e.label)
    }
    return []
  }

  const channelsColors = () => {
    if (getStatus === 'resolved') {
      return channelsInfo.map((e) => e.color ?? '#fff')
    }
    return []
  }

  useEffect(() => {
    if (getStatus === 'resolved') {
      setChannelsInfo(resource)
    }
  }, [resource])

  return {
    channels: channelsInfo,
    getChannelLabel,
    channelsLabels: channelsLabels(),
    channelsColors: channelsColors(),
  }
}
