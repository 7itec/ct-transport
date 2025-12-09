import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "expo-router";
import useTaksManagement from "./use-taks-management";

export function useTasksVerification() {
  const pathname = usePathname();

  const handleTaks = useTaksManagement();

  // Guarda o ID do interval atual
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Guarda o último pathname para evitar chamadas desnecessárias
  const lastPathRef = useRef<string | null>(null);
  // Garante que a inicialização só aconteça uma vez
  const initializedRef = useRef(false);

  const bannedPages = [
    "/work-journey/lunch-stop-lock",
    "/work-journey/lunch-time-needed",
    "/work-journey/uninformed-stop",
    "/work-journey/expired-work-journey",
    "/work-journey/standard-limit",
  ];

  const clearCurrentInterval = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startLoop = useCallback(() => {
    // Sempre limpa qualquer loop anterior antes de criar outro
    clearCurrentInterval();

    // Executa nas páginas permitidas
    if (bannedPages.includes(lastPathRef.current!)) return;

    handleTaks();

    // Cria um novo loop a cada 1 minuto
    intervalRef.current = setInterval(() => {
      if (!bannedPages.includes(lastPathRef.current!)) handleTaks();
    }, 60 * 1000);
  }, [handleTaks, pathname]);

  // Inicializa uma única vez quando o hook monta
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      lastPathRef.current = pathname;
      startLoop();
    }

    // Cleanup geral quando o componente desmontar
    return () => {
      clearCurrentInterval();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // sem deps para garantir apenas 1 vez

  // Observa mudanças de pathname
  useEffect(() => {
    // Se ainda não inicializou, não faz nada
    if (!initializedRef.current) return;

    // Se o pathname não mudou de fato, ignora
    if (lastPathRef.current === pathname) return;

    // Atualiza o pathname atual
    lastPathRef.current = pathname;

    if (bannedPages.includes(pathname)) return;

    // Reinicia o loop contando 1 minuto a partir desta troca
    startLoop();
  }, [pathname, startLoop]); // depende apenas do pathname
}
