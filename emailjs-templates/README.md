# Guia de Configuração - EmailJS & Prime Academy

Este diretório contém os templates HTML premium e as instruções necessárias para integrar os formulários do website da Prime Academy com o seu serviço de e-mail através da plataforma **EmailJS**.

Os e-mails serão enviados diretamente para **`comercialprimeacademy@gmail.com`**.

---

## Passo 1: Configurar a Conta EmailJS

1. Aceda a [EmailJS](https://www.emailjs.com/) e inicie sessão ou crie uma conta.
2. No menu lateral, clique em **Email Services** e depois em **Add New Service**.
3. Escolha o seu fornecedor de e-mail (por exemplo, Gmail, Outlook ou um servidor SMTP próprio).
4. Ligue a conta pretendida, dê um nome ao serviço (ex: `Prime Academy Service`) e clique em **Create Service**.
5. Copie o **Service ID** gerado (será usado no arquivo `.env` como `NEXT_PUBLIC_EMAILJS_SERVICE_ID`).

---

## Passo 2: Criar o Template de Contacto

1. No menu lateral do EmailJS, clique em **Email Templates** e depois em **Create New Template**.
2. No editor de template, clique no botão **Source** (Código Fonte `<>`) ou limpe o conteúdo padrão e edite o HTML.
3. Abra o ficheiro [`contact-template.html`](./contact-template.html), copie todo o seu código e cole no editor do EmailJS.
4. Ajuste as configurações do template no painel lateral direito:
   - **To Email**: `comercialprimeacademy@gmail.com` *(Importante: Isto garante que todos os contactos caem nesta caixa)*
   - **Subject**: `[Contacto Site] {{course}} - de {{name}}`
   - **From Name**: `Prime Academy Website`
   - **Reply-To**: `{{email}}` *(Permite responder diretamente ao cliente clicando em "Responder")*
5. Clique em **Save** no topo do editor.
6. Copie o **Template ID** gerado (será usado no arquivo `.env` como `NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID` ou `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`).

---

## Passo 3: Criar o Template de Inscrição

1. Clique novamente em **Create New Template** para criar um segundo template dedicado a inscrições de cursos.
2. Clique no botão **Source** (Código Fonte `<>`) ou edite o HTML.
3. Abra o ficheiro [`enrollment-template.html`](./enrollment-template.html), copie todo o seu código e cole no editor.
4. Ajuste as configurações do template no painel lateral direito:
   - **To Email**: `comercialprimeacademy@gmail.com` *(Garante que as inscrições também caem nesta caixa)*
   - **Subject**: `[Inscrição Site] {{course}} - {{name}}`
   - **From Name**: `Prime Academy Website`
   - **Reply-To**: `{{email}}` *(Permite responder diretamente ao candidato)*
5. Clique em **Save**.
6. Copie o **Template ID** gerado (será usado no arquivo `.env` como `NEXT_PUBLIC_EMAILJS_ENROLL_TEMPLATE_ID`).

---

## Passo 4: Configurar as Variáveis de Ambiente

No menu lateral do EmailJS, vá a **Account** e copie a sua **Public Key**.

Em seguida, no seu servidor/ambiente de desenvolvimento, abra ou crie o ficheiro `.env` na raiz do projeto e configure as seguintes chaves com os valores copiados:

```env
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=seu_service_id_aqui
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=sua_public_key_aqui

# IDs específicos dos templates
NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID=seu_template_id_de_contacto_aqui
NEXT_PUBLIC_EMAILJS_ENROLL_TEMPLATE_ID=seu_template_id_de_inscricao_aqui

# Fallback (caso queira usar o mesmo template para ambos, use esta variável)
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=seu_template_id_de_contacto_aqui
```

---

## Estrutura das Variáveis de Substituição

Os templates HTML utilizam os seguintes parâmetros que são enviados automaticamente pelo código:

| Parâmetro | Descrição | Formulário |
| :--- | :--- | :--- |
| `{{name}}` | Nome completo do utilizador/candidato | Contacto e Inscrição |
| `{{email}}` | Endereço de e-mail | Contacto e Inscrição |
| `{{phone}}` | Contacto de WhatsApp ou Telefone | Contacto e Inscrição |
| `{{course}}` | Curso de interesse ou Assunto selecionado | Contacto e Inscrição |
| `{{message}}` | Mensagem descritiva ou observações | Contacto e Inscrição |
| `{{to_email}}` | `comercialprimeacademy@gmail.com` (passado programaticamente) | Ambos |
