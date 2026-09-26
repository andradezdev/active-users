# Guia de Instalação e Manutenção — Active Users

Este documento contém o guia prático de comandos de terminal para instalação, atualização e desinstalação do aplicativo **Active Users** no Frappe Bench.

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

## 2. Atualização

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

## 3. Desinstalação

Para desinstalar o aplicativo de um site específico:

```bash
cd ~/frappe-bench
bench --site [sitename] uninstall-app active_users
```

Para remover o aplicativo completamente do bench:

```bash
bench remove-app active-users
```
