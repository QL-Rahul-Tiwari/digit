import { useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [isWifi, setIsWifi] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const online = state.isConnected === true;
      setIsOnline(online);
      setIsWifi(state.type === 'wifi');
    });

    return () => unsubscribe();
  }, []);

  return { isOnline, isWifi };
}
