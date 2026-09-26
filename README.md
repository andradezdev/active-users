# Active Users — Monitoramento de Usuários Ativos para Frappe e ERPNext

[![Frappe Framework](https://img.shields.io/badge/Frappe-v14%20--%20v16-blue.svg)](https://frappeframework.com/)
[![ERPNext](https://img.shields.io/badge/ERPNext-v14%20--%20v16-blue.svg)](https://erpnext.com/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-green.svg)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-orange.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()

O **Active Users** é um aplicativo modular e leve desenvolvido para o **Frappe Framework** e **ERPNext** (compatível com as versões 14, 15 e 16) que exibe em tempo real os usuários atualmente conectados e ativos no sistema.

Integrado diretamente à barra de navegação do Desk (`/desk`) e às barras superiores das páginas do sistema (`.page-head`), o aplicativo fornece aos administradores e gestores visibilidade imediata de quem está trabalhando na plataforma, com suporte completo aos temas Claro e Escuro (*Dark Mode*), avatars dinâmicos, controle de cache e regras granulares de visibilidade.

---

## 🚀 Principais Recursos

- **Monitoramento em Tempo Real:** Visualização instantânea da lista de usuários ativos, com foto/avatar, nome completo e contagem total.
- **Compatibilidade Nativa com Frappe v16:** Totalmente adaptado para a nova interface de Desk do Frappe v16 (`.desktop-navbar`), além de manter compatibilidade com visões de Workspace, formulários e listas.
- **Design Moderno:** Utiliza a biblioteca oficial de ícones SVG Lucide do Frappe, respeitando o padrão visual e as variáveis de cores (`CSS variables`) do tema ativo.
- **Intervalo de Atualização Configurável:** Permite ajustar a frequência de sincronização automática (em minutos) e botão de atualização manual sob demanda.
- **Controle Fino de Acesso e Visibilidade:**
  - Filtragem por tipos de usuário (`User Types`, ex: System User).
  - Regras para ocultar ou exibir o widget para Funções (`Roles`) ou Usuários específicos.
- **Atalho de Administração Direto:** Usuários administradores (`System Manager` / `Administrator`) contam com atalho direto no cabeçalho do popup para abrir as **Configurações de Usuários Ativos**.
- **Otimizado para Desempenho:** Consultas em lote com suporte a cache no Redis (`RedisWrapper`), evitando sobrecarga no banco de dados MariaDB.
- **Totalmente Traduzido:** Interface e telas de configuração disponíveis em Português do Brasil (`pt-BR`).

---

## 📋 Pré-requisitos

- Frappe Framework v14.0.0 ou superior (incluindo Frappe v16)
- Python 3.10+
- Node.js 18+ e Yarn (para compilação de bundles)

---

## 📦 Instalação

Consulte o arquivo [LEIAME.md](LEIAME.md) para o passo a passo completo de comandos no terminal:

```bash
# 1. Obter o app no bench
bench get-app https://github.com/andradezdev/active-users.git

# 2. Instalar no site desejado
bench --site [sitename] install-app active_users

# 3. Compilar os assets frontend
bench build --app active_users

# 4. Limpar o cache do site
bench --site [sitename] clear-cache
```

---

## ⚙️ Configuração

Após a instalação, configure o comportamento do monitoramento:

1. Na barra de busca do Desk ou no atalho do widget, acesse **Configurações de Usuários Ativos** (`Active Users Settings`).
2. Marque a opção **Habilitado** (`Is Enabled`).
3. Defina o **Intervalo de Atualização** desejado (padrão: 5 minutos) e se deseja **Permitir Atualização Manual**.
4. Na seção **Visibilidade**:
   - Selecione os **Tipos de Usuário para Exibir** (ex: *System User*).
   - Opcionalmente configure restrições por **Funções** (`Roles`) ou **Usuários** (`Users`).
5. Clique em **Salvar**. As alterações entram em vigor imediatamente.

---

## 📄 Licença

Este projeto é distribuído sob os termos da licença [MIT](LICENSE).
