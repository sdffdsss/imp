import { useEffect, useRef } from 'react';
import Stomp from 'stompjs';

export function useWSConnection(serverUrl, destination, onMessage) {
    const stompClientRef = useRef<any>();
    const onMessageRef = useRef<undefined | Function>();
    const initClientRef = useRef<undefined | Function>();

    onMessageRef.current = onMessage;

    initClientRef.current = function initClient() {
        stompClientRef.current = Stomp.client(serverUrl);

        stompClientRef.current?.connect({}, () => {
            stompClientRef.current?.subscribe(
                destination,
                (message) => {
                    if (message.body) {
                        onMessageRef.current?.(JSON.parse(message.body));
                    }
                },
                (error) => {
                    console.log('%cWS客户端连接失败，错误信息:', 'color:red', error, '重试中...');
                    initClient();
                },
            );
        });
    };

    useEffect(() => {
        initClientRef.current?.();

        return () => {
            stompClientRef.current?.disconnect();
        };
    }, [serverUrl, destination]);
}
