# RandDBD

O RandDBD é um randomizador de perks de sobreviventes de **Dead by Daylight**. Ele sorteia quatro perks para cada jogador, seja para experimentar uma build diferente ou montar um desafio com amigos.

[Abrir o RandDBD](https://randdbd.vercel.app)

## Como usar

1. Escolha de **1 a 4 jogadores** e, se quiser, preencha os nomes para identificar as builds.
2. Escolha se uma mesma perk pode aparecer nas builds de jogadores diferentes. Cada jogador sempre recebe quatro perks distintas. Com a opção de repetição desativada, todas as perks sorteadas são diferentes em todo o esquadrão.
3. Clique em **Randomizar loadouts** para sortear as builds.
4. Clique em uma perk para ver seu ícone, o sobrevivente associado (ou a indicação **Geral**) e a descrição do efeito em inglês.
5. Use **Rolar novamente** para sortear todas as builds. Em partidas com mais de um jogador, use **Rolar este** para trocar as quatro perks de apenas um jogador.

O sorteio acontece no navegador, sem login. O catálogo inclui perks gerais e exclusivas de sobreviventes. Confira no jogo se você já desbloqueou as perks sorteadas antes de montar a build.

## Como rodar localmente

Use **Node.js 22.12 ou superior** e **pnpm**.

```bash
git clone https://github.com/RichardBrendon/RandDBD.git
cd RandDBD
pnpm install
pnpm dev
```

Abra [http://localhost:5173](http://localhost:5173). Para gerar a compilação de produção, execute `pnpm build`. Para verificar a formatação do código, execute `pnpm format:check`.

## Android

[Baixar o APK mais recente](https://github.com/RichardBrendon/RandDBD/releases/latest/download/randdbd.apk)

O app Android inclui a interface, o catálogo, os ícones e as fontes no APK. O sorteio e os detalhes das perks funcionam offline.

Para gerar um APK de teste, instale o Android Studio com o SDK Android 36 e configure o terminal para usar o JDK 21 e o diretório do SDK. Depois de executar `pnpm install`, rode:

```powershell
pnpm android:sync
cd android
.\gradlew.bat assembleDebug
```

O APK de teste fica em `android/app/build/outputs/apk/debug/app-debug.apk`. Para abrir o projeto no Android Studio, execute `pnpm android:open` na raiz. Repita a sincronização após atualizar a interface ou o catálogo.

Para distribuir uma versão pública, gere um **APK de lançamento assinado** no Android Studio. Guarde a chave fora do repositório e use a mesma chave e o mesmo identificador de pacote nas atualizações. Aumente o `versionCode` em `android/app/build.gradle` a cada lançamento.

## Estrutura do projeto

O site usa **React**, **Vite** e **CSS**. O catálogo e os ícones fazem parte do projeto.

- [`src/components/`](src/components/) contém a interface de configuração, resultados e detalhes das perks.
- [`src/hooks/useLoadoutRandomizer.js`](src/hooks/useLoadoutRandomizer.js) controla as configurações e os resultados do sorteio.
- [`src/utils/randomizer.js`](src/utils/randomizer.js) contém as regras de sorteio e repetição.
- [`src/data/survivor-perks.json`](src/data/survivor-perks.json) e [`public/perks/`](public/perks/) guardam o catálogo e os ícones.

## Créditos

RandDBD é um projeto de fãs. Dead by Daylight, seus personagens e ícones pertencem aos respectivos titulares. O catálogo usa a [Dead by Daylight Wiki](https://deadbydaylight.wiki.gg/wiki/Perks) como referência.

Encontrou uma descrição desatualizada ou um erro no sorteio? [Abra uma issue](https://github.com/RichardBrendon/RandDBD/issues) com o nome da perk ou os passos para reproduzir o problema.
