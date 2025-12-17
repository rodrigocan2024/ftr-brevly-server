# Brev.ly - Server

## Requisitos

- [x] Deve ser possível criar um link
  - [ ] Não deve ser possível criar um link com URL encurtada mal formatada
  - [x] Não deve ser possível criar um link com URL encurtada já existente
- [x] Deve ser possível deletar um link
- [x] Deve ser possível obter a URL original por meio de uma URL encurtada
- [ ] Deve ser possível listar todas as URL’s cadastradas
- [x] Deve ser possível incrementar a quantidade de acessos de um link
- [ ] Deve ser possível exportar os links criados em um CSV
  - [ ] Deve ser possível acessar o CSV por meio de uma CDN (Amazon S3, Cloudflare R2, etc)
  - [ ]  Deve ser gerado um nome aleatório e único para o arquivo
  - [ ]  Deve ser possível realizar a listagem de forma performática
  - [ ]  O CSV deve ter campos como, URL original, URL encurtada, contagem de acessos e data de criação.
