POST {{API_URL}}/pairql/order/CreateOrder
Authorization: Bearer deadbeef-dead-beef-dead-beefdeadbeef
{
    "lang": "en",
    "email": "jared@netrivet.com",
    "source": "internal",
    "addressCity": "Buenos Aires",
    "addressCountry": "AR",
    "addressName": "Jared Henderson",
    "addressState": "CABA",
    "addressStreet": "Avenida Corrientes 1234",
    "addressStreet2": "Piso 5, Departamento A",
    "addressZip": "C1043AAZ",
    "amount": 1851,
    "shipping": 1519,
    "taxes": 0,
    "fees": 75,
    "ccFeeOffset": 0,
    "shippingLevel": "mail",
    "paymentId": "internal--complimentary--6a0e43f4",
    "recipientTaxId": "30-70737344-6",
    "items": [
        {
            "editionId": "f79d1c53-d3cc-441d-8a31-903e69e1bb64",
            "quantity": 1,
            "unitPrice": 257
        }
    ]
}
