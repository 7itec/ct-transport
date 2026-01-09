interface MaterialDeApoio {
  _id: string;
  name: string;
}

interface EstoqueMaterialDeApoio {
  _id: string;
  materialDeApoioId: string;
  materialDeApoio: MaterialDeApoio;
}

interface Veiculo {
  _id: string;
  estoqueMaterialDeApoioIds: string[];
  estoqueMaterialDeApoio: EstoqueMaterialDeApoio[];
}
