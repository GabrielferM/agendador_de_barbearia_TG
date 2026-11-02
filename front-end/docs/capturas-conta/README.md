# Contas públicas — capturas de validação

Chromium headless, com HTTP/sessão simulados, nas larguras 1440×1000,
390×844 e 320×740. Estas imagens não representam um servidor/banco real nem
evidência de entrega de e-mail. Tokens e endereços são fictícios.

| Cenário | Desktop | Celular | Estreito |
| --- | --- | --- | --- |
| Cadastro | [Imagem](cadastro-desktop.png) | [Imagem](cadastro-celular.png) | [Imagem](cadastro-estreito.png) |
| Cadastro com erros e nome longo | [Imagem](cadastro-erros-desktop.png) | [Imagem](cadastro-erros-celular.png) | [Imagem](cadastro-erros-estreito.png) |
| Recuperação | [Imagem](recuperar-desktop.png) | [Imagem](recuperar-celular.png) | [Imagem](recuperar-estreito.png) |
| Envio pendente | [Imagem](recuperar-enviando-desktop.png) | [Imagem](recuperar-enviando-celular.png) | [Imagem](recuperar-enviando-estreito.png) |
| Recuperação concluída e reenvio em espera | [Imagem](recuperar-sucesso-desktop.png) | [Imagem](recuperar-sucesso-celular.png) | [Imagem](recuperar-sucesso-estreito.png) |
| Nova senha | [Imagem](redefinir-desktop.png) | [Imagem](redefinir-celular.png) | [Imagem](redefinir-estreito.png) |
| Token ausente | [Imagem](token-ausente-desktop.png) | [Imagem](token-ausente-celular.png) | [Imagem](token-ausente-estreito.png) |

Conferidos: ausência de overflow horizontal, labels/campos/botões legíveis,
foco no campo inválido, fragmento do token removido ao abrir a página e
botão bloqueado durante envio/reenvio. Os testes de componentes exercitam
conflito, limite, rede, expiração e sucesso da redefinição.
