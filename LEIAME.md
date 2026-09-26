# Guia de Instalação e Configuração — Active Users

Este documento contém o guia prático de comandos de terminal para instalação, atualização, desinstalação e configuração de parâmetros do aplicativo **Active Users** no ecossistema **ERPZ**.

> ⚠️ **Importante**: Substitua `[sitename]` pelo nome do site onde deseja operar (ex: `dev.erpz.io`).

---

## 1. Instalação

Acesse a pasta do seu bench:

```bash
cd ~/frappe-bench
```

Clone o repositório do aplicativo:

```bash
bench get-app https://github.com/andradezdev/active-users.git
```

Compile os arquivos estáticos (CSS e JS):

```bash
bench build --app active_users
```

Instale o aplicativo no site de destino:

```bash
bench --site [sitename] install-app active_users
```

Execute a migração para registrar os DocTypes e campos:

```bash
bench --site [sitename] migrate
```

Limpe o cache do site:

```bash
bench --site [sitename] clear-cache
```

---

## 2. Configuração e Parametrização

Após a instalação, configure o comportamento do monitoramento no Desk:

1. Na barra de busca do Desk ou no atalho do widget no topo da tela, acesse **Configurações de Usuários Ativos** (`Active Users Settings`).
2. Marque a opção **Habilitado** (`Is Enabled`).
3. Defina o **Intervalo de Atualização** desejado (padrão: 5 minutos) e se deseja **Permitir Atualização Manual**.
4. Na seção **Visibilidade**:
   - Selecione os **Tipos de Usuário para Exibir** (ex: *System User*).
   - Opcionalmente configure restrições por **Funções** (`Roles`) ou **Usuários** (`Users`) para limitar quem pode visualizar o widget.
5. Clique em **Salvar**. As alterações entram em vigor imediatamente.

---

## 3. Atualização

Para atualizar o aplicativo com as últimas modificações do repositório:

```bash
cd ~/frappe-bench/apps/active-users
git pull origin main
cd ~/frappe-bench
bench build --app active_users
bench --site [sitename] migrate
bench --site [sitename] clear-cache
```

Se necessário, reinicie os serviços do bench:

```bash
sudo supervisorctl restart all
```

---

## 4. Desinstalação

Para desinstalar o aplicativo de um site específico:

```bash
cd ~/frappe-bench
bench --site [sitename] uninstall-app active_users
```

Para remover o aplicativo completamente do bench:

```bash
bench remove-app active-users
```
