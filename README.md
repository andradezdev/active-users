# Active Users — Monitoramento de Usuários Ativos para Frappe e ERPZ

[![Frappe Framework](https://img.shields.io/badge/Frappe-v14%20--%20v16-blue.svg)](https://frappeframework.com/)
[![ERPZ](https://img.shields.io/badge/ERPZ-v14%20--%20v16-blue.svg)](https://erpz.io/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-green.svg)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-orange.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()

O **Active Users** é um aplicativo modular e leve desenvolvido para o **Frappe Framework** e **ERPZ** (compatível com as versões 14, 15 e 16) que exibe em tempo real os usuários atualmente conectados e ativos no sistema.

Integrado diretamente à barra de navegação do Desk (`/desk`) e às barras superiores das páginas do sistema (`.page-head`), o aplicativo fornece aos administradores e gestores visibilidade imediata de quem está trabalhando na plataforma, com suporte completo aos temas Claro e Escuro (*Dark Mode*), avatars dinâmicos, controle de cache e regras granulares de visibilidade.

---

## 🚀 Principais Recursos

- **Monitoramento em Tempo Real:** Visualização instantânea da lista de usuários ativos, com foto/avatar, nome completo e contagem total.
- **Compatibilidade Nativa com ERPZ v16:** Totalmente adaptado para a nova interface de Desk do Frappe/ERPZ v16 (`.desktop-navbar`), além de manter compatibilidade com visões de Workspace, formulários e listas.
- **Design Moderno:** Utiliza a biblioteca oficial de ícones SVG Lucide do Frappe, respeitando o padrão visual e as variáveis de cores (`CSS variables`) do tema ativo.
- **Intervalo de Atualização Configurável:** Permite ajustar a frequência de sincronização automática (em minutos) e botão de atualização manual sob demanda.
- **Controle Fino de Acesso e Visibilidade:**
  - Filtragem por tipos de usuário (`User Types`, ex: System User).
  - Regras para ocultar ou exibir o widget para Funções (`Roles`) ou Usuários específicos.
- **Atalho de Administração Direto:** Usuários administradores (`System Manager` / `Administrator`) contam com atalho direto no cabeçalho do popup para abrir as configurações.
- **Otimizado para Desempenho:** Consultas em lote com suporte a cache no Redis (`RedisWrapper`), evitando sobrecarga no banco de dados MariaDB.
- **Totalmente Traduzido:** Interface e telas de configuração disponíveis em Português do Brasil (`pt-BR`).

---

## 📋 Pré-requisitos

- Frappe Framework v14.0.0 ou superior (incluindo Frappe / ERPZ v16)
- Python 3.10+
- Node.js 18+ e Yarn (para compilação de bundles)

---

## 📖 Instalação e Configuração

As instruções práticas de comandos no terminal (instalação via bench, compilação de assets, migração e atualização) e o guia de configuração de permissões e visibilidade foram organizados em um arquivo separado:

👉 **Consulte o guia completo em [LEIAME.md](LEIAME.md)**

---

## 📄 Licença

Este projeto é distribuído sob os termos da licença [MIT](LICENSE).
