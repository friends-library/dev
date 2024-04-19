import Fluent
import FluentPostgresDriver
import Vapor

struct HandleEditionIds: AsyncMigration {

  func prepare(on database: Database) async throws {
    Current.logger.info("Running migration: HandleEditionIds UP")
    let sqlDb = database as! SQLDatabase

    try await createNonForeignKeyNullableColumns(database)

    if Env.get("SKIP_LEGACY_DATA_MIGRATION_STEPS") != "true" {
      try await addEditionIds(sqlDb)
    }

    try await removeColumns(database)
  }

  private func createNonForeignKeyNullableColumns(_ database: Database) async throws {
    try await database.schema(Download.M1.tableName)
      .field(Download.M10.editionId, .uuid)
      .update()
    try await database.schema(OrderItem.M3.tableName)
      .field(OrderItem.M10.editionId, .uuid)
      .update()
  }

  private func removeColumns(_ database: Database) async throws {
    try await database.schema(Download.M1.tableName)
      .deleteField(Download.M1.documentId)
      .deleteField(Download.M1.editionType)
      .update()
    try await database.schema(OrderItem.M3.tableName)
      .deleteField(OrderItem.M3.documentId)
      .deleteField(OrderItem.M3.editionType)
      .deleteField(OrderItem.M3.title)
      .update()
  }

  private func addEditionIds(_ db: SQLDatabase) async throws {
    for (combined, uuidString) in editionIdMigrationMap {
      let parts = combined.split(separator: "/")
      let documentId = parts[0]
      let editionType = parts[1]

      let updateDownload = """
      UPDATE \(Download.M1.tableName)
      SET \(Download.M10.editionId) = '\(uuidString)'
      WHERE
        \"\(Download.M1.documentId)\" = '\(documentId)'
      AND
        \"\(Download.M1.editionType)\" = '\(editionType)'
      """
      _ = try await db.raw("\(raw: updateDownload)").all()

      let updateOrderItem = """
      UPDATE \(OrderItem.M3.tableName)
      SET \(OrderItem.M10.editionId) = '\(uuidString)'
      WHERE
        \"\(OrderItem.M3.documentId)\" = '\(documentId)'
      AND
        \"\(OrderItem.M3.editionType)\" = '\(editionType)'
      """
      _ = try await db.raw("\(raw: updateOrderItem)").all()
    }
  }

  func revert(on database: Database) async throws {
    Current.logger.info("Running migration: HandleEditionIds DOWN")
    // don't really care to try to reverse this one...
  }
}

// extensions

extension Download {
  enum M10 {
    nonisolated(unsafe) static let editionId = FieldKey("edition_id")
  }
}

extension OrderItem {
  enum M10 {
    nonisolated(unsafe) static let editionId = FieldKey("edition_id")
  }
}

extension HandleEditionIds {
  var editionIdMigrationMap: [String: String] {
    [
      "69c5fc26-76e3-4302-964e-ba46d889003b/modernized": "0a4e9e87-3a4a-4bd3-8361-457f78893983",
      "a5a7cc71-bee0-4e71-80ae-e9167e140df4/modernized": "30f4e4b0-a33d-4efa-b3ba-88cfbec76d9e",
      "a5a7cc71-bee0-4e71-80ae-e9167e140df4/original": "6802f7aa-27ce-4a81-9b43-e2c414cabedb",
      "a5a7cc71-bee0-4e71-80ae-e9167e140df4/updated": "c8255c46-8463-4e2d-b3e8-39a668eb9b10",
      "b7cdfbb1-abf9-47b9-a483-a9e7dee6b435/updated": "c3e8b421-496b-4a12-8627-6e4eff548730",
      "6b0e134d-8d2e-48bc-8fa3-e8fc79793804/modernized": "49bd9dc3-ac69-4d0f-853b-e8e96af6b7ab",
      "6b0e134d-8d2e-48bc-8fa3-e8fc79793804/original": "baddcfb9-bd21-4ad3-8a74-3c39a9822bd3",
      "841500ef-cd48-4a42-8bd4-90ee841d19b4/modernized": "ee769857-ecdf-44bc-8010-1416e961b58c",
      "841500ef-cd48-4a42-8bd4-90ee841d19b4/original": "1cd188c8-0332-4aa2-9745-803c967bcd22",
      "025ae678-5e76-4128-9b59-b0761a7cb9d1/modernized": "fa5ed07d-2b6f-43c8-8c50-bda5dedc8d5e",
      "025ae678-5e76-4128-9b59-b0761a7cb9d1/original": "619223f5-9a9a-4bfb-be07-8da409646149",
      "a242c43b-2c05-43d8-836d-08efb90c7844/modernized": "35c1836f-44c7-44d5-aa0f-39a67086b3f1",
      "a242c43b-2c05-43d8-836d-08efb90c7844/original": "ab918feb-d582-48a3-8616-f133a35a3b12",
      "81171796-9b62-46dd-a73e-44cb807e48b0/modernized": "62b35274-eef4-4e75-b8be-605aaadbe625",
      "81171796-9b62-46dd-a73e-44cb807e48b0/original": "fb31da5b-3c80-4882-804d-7821d07aba79",
      "08b94a0b-b96f-4525-bd46-79b0d60c4302/modernized": "5c08af59-8612-48b7-a527-0cb39b0241e8",
      "a40a3ac1-af68-474f-bf76-66028ca17b49/updated": "d89171b9-13c4-4c12-927b-64e1065f2c8a",
      "0e7ca047-14ff-4883-8977-877d36632d11/modernized": "76923c7d-8705-4409-9bb4-766a54aa6b52",
      "0e7ca047-14ff-4883-8977-877d36632d11/original": "c5c5e048-47a5-4d98-a377-5b466a0b1c46",
      "9ac03f31-dba4-4723-a8cd-4a67bde65757/updated": "17f020fe-d651-40e7-a88d-da9273db7bc5",
      "8efe55b2-00e9-432b-853f-fc5f3cb8deaf/modernized": "ca5eaae5-eb57-45ff-ae2f-01c820527422",
      "8efe55b2-00e9-432b-853f-fc5f3cb8deaf/original": "29aa7e4f-e0b0-4c39-a421-2c6758d4daea",
      "769b12e4-b909-4fb0-9177-b74a1bef9f35/modernized": "f2071724-d9ab-452f-86e2-4f1bd8e7b242",
      "769b12e4-b909-4fb0-9177-b74a1bef9f35/original": "23beff6e-ba87-4d67-ac64-b43ca2a63890",
      "769b12e4-b909-4fb0-9177-b74a1bef9f35/updated": "af10e9c3-f31f-4708-bb19-2f303ad13b53",
      "ede0dbbf-d031-4180-9ee5-e78641be72cd/modernized": "bc612ea4-4ddc-4451-a841-164dd224c0d5",
      "ede0dbbf-d031-4180-9ee5-e78641be72cd/original": "bfef96ad-a814-4be0-b0f7-f85e550f5764",
      "843e3d87-d877-432c-a54e-fbe7996022a8/modernized": "baec54d2-a494-4bf5-bb6d-27305811ed97",
      "843e3d87-d877-432c-a54e-fbe7996022a8/original": "2611446e-d1e8-4280-9f21-cbcc6e8e5da4",
      "1613ce28-3ff2-4802-b22f-111039e6e0ac/modernized": "27e30eea-8080-4d66-86c2-8e4365f556dc",
      "1613ce28-3ff2-4802-b22f-111039e6e0ac/original": "cdf0e3c4-6ad4-420f-a2c2-fc88a0ff50b8",
      "8e77ebe3-8678-44d2-9826-8c1be2633dcc/modernized": "674da50d-f984-40fe-bd2b-5a8ab6eb5440",
      "8e77ebe3-8678-44d2-9826-8c1be2633dcc/original": "d7ec46ab-e407-4bdd-9143-02e5414f073a",
      "951f52bb-fc11-4e76-a08d-c3dc52b8a07c/modernized": "12f4401b-ffac-4bd2-8da0-241fbc344917",
      "951f52bb-fc11-4e76-a08d-c3dc52b8a07c/original": "9768f6a0-9871-425f-a5fa-ad9f1642b7d2",
      "46cffe12-7fac-486d-8597-afecee546baa/modernized": "ea0efddd-f4d9-4336-9eb5-1cc5936d5f98",
      "46cffe12-7fac-486d-8597-afecee546baa/original": "bce981ee-a320-4431-882a-8142a5147aae",
      "280c72ea-df5b-4504-a140-51aec77455e0/updated": "a3efbecf-2d8d-4396-8dd2-5e2303f92d5d",
      "6793d8a5-4352-4c10-901c-7d1afbff80a6/updated": "f9e8f8df-2323-4084-aa8d-c924ce551e25",
      "778b9e77-1c50-4044-b6e5-487d629fb08b/updated": "f187b29e-49e4-4c03-a2cb-1d157d490f33",
      "960e1f3b-deb2-480a-83bf-ca7dfd3b965c/modernized": "014d0820-72cd-4fec-b118-721ab009130d",
      "960e1f3b-deb2-480a-83bf-ca7dfd3b965c/original": "16146b7c-ea4e-40b9-844d-1341d364fd69",
      "9811730b-0a00-4dea-b01f-c676df865802/modernized": "b63a888f-1c4b-4514-a08f-49e8b85989b4",
      "9811730b-0a00-4dea-b01f-c676df865802/original": "76b23a95-7664-4c88-8ee2-ace114433411",
      "3c1f4d2b-cefb-4a8f-a0aa-ad9de657b15f/modernized": "c66fefc7-d93b-4de5-be1c-ad9e1c80657f",
      "3c1f4d2b-cefb-4a8f-a0aa-ad9de657b15f/original": "f9850ef5-2cff-4fbc-bfa9-c5a5e80d673d",
      "fbcf0659-f2d1-45fd-b560-15b98271dac2/updated": "f38dd2ea-ee4a-4f5a-a097-c9b635b03ee4",
      "ad6a0837-7797-4c6c-a641-bfb722bedf21/modernized": "13da2bcd-05b8-4cc9-af54-1f8fa2b32384",
      "ad6a0837-7797-4c6c-a641-bfb722bedf21/original": "091269fe-4279-4325-b5ce-a69245facdbb",
      "052ac10e-2c75-42c5-aa35-f38f34aa1214/modernized": "9327540f-76e9-494d-a3da-6b8f79e6db4d",
      "052ac10e-2c75-42c5-aa35-f38f34aa1214/original": "4515c2ba-53e6-4440-bfb9-696c147283ba",
      "14f4fcbb-1027-4364-977e-5a2aba92a827/modernized": "cd4816c8-61c4-42a0-91cc-6b8b71afb393",
      "14f4fcbb-1027-4364-977e-5a2aba92a827/original": "b221711c-1bed-43d3-89e9-a705bc5b3e17",
      "135d7df6-48b1-4808-a810-e69756cd9279/modernized": "f1e104a4-e4be-495c-b522-d8bc122968c1",
      "135d7df6-48b1-4808-a810-e69756cd9279/original": "dc4a15c7-85d7-44e2-a167-92155583bd82",
      "c3f25765-0b8a-4fd4-99cf-28a159a23e21/modernized": "843e8384-8542-432f-9cff-c45b18bc4894",
      "c3f25765-0b8a-4fd4-99cf-28a159a23e21/original": "a3ce4f0d-05f4-4598-beb4-a6debfee9769",
      "492a89d4-0f81-490a-9619-b3a390d51307/updated": "60f9433d-178a-47bf-b254-730ae6137bb8",
      "e27bc78c-ab04-4020-8c9f-9f1eed4f98e2/modernized": "59c62189-ed1a-4cb2-80b1-43f1476d7a93",
      "e27bc78c-ab04-4020-8c9f-9f1eed4f98e2/updated": "c085601f-0e00-40c1-a271-3027c74e69ef",
      "4cde3c89-ab46-4f03-9346-5608a58e8393/modernized": "1d60fa37-0dc9-43ae-a031-d3f3edc4fde4",
      "4cde3c89-ab46-4f03-9346-5608a58e8393/original": "ddfefc0e-50d0-413b-ad0d-2502b808c492",
      "a52eb875-8a1a-4f2f-b1b4-650eb3af1126/updated": "b218e7b1-d3e3-4328-8ee6-770818805b2b",
      "20d1e00c-dd8b-4d28-9270-58c42b5c2b55/updated": "0cdaa0df-af7f-46cb-a9a2-d6b6d127e26c",
      "ac772bbc-3684-4436-801a-6a80215cda04/modernized": "58fdc473-affe-413c-a757-18759bf4e307",
      "ac772bbc-3684-4436-801a-6a80215cda04/original": "d8dd0c90-c78a-49bc-afec-67bba6e0f953",
      "fa1addc4-a434-48da-8d82-bbb1db322151/updated": "02bc54b2-8bf8-47b8-baec-e850221a834d",
      "dd809ae4-b0c0-46b4-8091-37329545d2d1/modernized": "56a911b7-d160-4436-99b7-02c98b807851",
      "dd809ae4-b0c0-46b4-8091-37329545d2d1/original": "1a942489-1d40-45b3-b75a-f66cd06ba133",
      "8f5f5597-76f0-4d36-9bdb-2746c9530a4e/original": "165cf244-c5cb-4ab2-923c-d63ff876d10c",
      "cb61d22a-4fc3-4fcb-94de-446fe50b49d2/original": "50755777-8a9f-4c06-980b-93d74ae817b8",
      "c352db51-cabc-47e8-ac58-bad1624bc070/original": "982be265-304e-4a88-8104-84cc04f04c9e",
      "f2ec6e4f-e07b-4f1f-a952-ab2e8ec8b041/original": "f8b4bc24-f47e-46c9-9eea-e991c9086906",
      "8558ff68-4d9d-47b6-8f00-57cade88b4c7/original": "d7e12858-aa6e-42f1-a1e9-ec47431abbfa",
      "f04088fc-c008-4630-a63a-b9bc40697080/original": "6f201da5-b8bc-4cc4-9e67-82b77174a35b",
      "dcf39e10-9eaf-4878-98de-380b531fc2ee/updated": "b9dbb471-ae74-4a13-b522-6d99701d9c4a",
      "e5a1ecfb-4f0a-4c71-80bf-3ee924d0f46c/original": "b3fb774d-1156-4155-b6ee-19fdc5735066",
      "1003add3-09be-4deb-8476-8a2be7c34405/updated": "4b4fb6d0-c986-4e93-8972-ca1adb992d8b",
      "eca687be-9a29-49d3-8394-2ed21b85f9a3/modernized": "9307d1c9-1b64-4866-b288-4b633c94d8d2",
      "eca687be-9a29-49d3-8394-2ed21b85f9a3/original": "6e2e4d48-a9d9-44fc-96d8-4d1f60272a19",
      "c43536d9-7992-4e18-9aea-9e51a5b93802/modernized": "d6e32cc4-968d-495b-93dc-4360d80f2735",
      "c43536d9-7992-4e18-9aea-9e51a5b93802/original": "70c09b03-a494-480b-8c79-00140f61b1fa",
      "35cd4c65-ea35-418d-a146-5bc3e5559247/modernized": "f09d52c6-4838-4706-9b80-61e21cd2e8a3",
      "35cd4c65-ea35-418d-a146-5bc3e5559247/original": "e5dd3a21-4105-4ef5-a6a2-e80636269cb4",
      "c9d8a647-792f-47c2-a0c5-4ba8773d5cc6/modernized": "9e4bf169-5bce-4962-8a60-416322b58919",
      "c9d8a647-792f-47c2-a0c5-4ba8773d5cc6/original": "aacb89bd-ef38-44d0-9210-a8306b216c2a",
      "9333dd0a-d92b-401e-a086-f611cc20f984/modernized": "b2779afd-8555-4a7e-95f0-37d7078a71d7",
      "9333dd0a-d92b-401e-a086-f611cc20f984/original": "f79d1c53-d3cc-441d-8a31-903e69e1bb64",
      "9333dd0a-d92b-401e-a086-f611cc20f984/updated": "11d6166f-ffbf-42a1-8cf4-db851e03a427",
      "bed1a75e-bf7c-4bb4-9a84-1e6c908f6011/modernized": "9bca1b47-dbf3-4bbc-8bf2-cdb6bf7310db",
      "bed1a75e-bf7c-4bb4-9a84-1e6c908f6011/original": "816e17c7-82c9-4ee5-b810-ecbb406d955f",
      "491af758-8872-4de2-a958-d9059761a661/original": "d3910156-be2b-4deb-8a60-c28da5ccb946",
      "1e2ad3c4-d14e-4277-b2f4-a520de5d5409/original": "bb735fb9-a161-4291-a1f4-76a14457fbc4",
      "f2f76200-7cb1-491a-a6d5-e5ecae939d28/original": "34d1b239-e56f-4bb5-8ea6-b0ea5df9204a",
      "7727b95b-960f-491c-ac61-cf876d10b278/original": "70ca4d90-a8a3-44c7-b000-35f0f2cec401",
      "c248c2e7-947b-4629-8296-0cdff67a6d99/updated": "2a159a26-bb30-42d8-98c3-487326fbe1bf",
      "62213938-9464-4930-9478-5f112c43fe54/updated": "fc339523-ff5a-4591-b281-908296eb6623",
      "d0d15232-db51-48fc-a8ed-5e0b206f9a3f/modernized": "c655e8d7-9441-4276-bcbd-e7c0d240935b",
      "d0d15232-db51-48fc-a8ed-5e0b206f9a3f/original": "3ee9ea49-e519-413c-a2e3-09ecf9747fd1",
      "9c43d93e-8bfb-43bc-a238-310cf00b77a1/modernized": "f09d6e44-0fc1-4fe3-9662-d8cea83f43a8",
      "9c43d93e-8bfb-43bc-a238-310cf00b77a1/original": "28977899-d1c5-4b8e-947a-48f7976a430e",
      "d94f2fb3-f19f-4aa3-a3a0-9b2ddf87da9c/updated": "f80cb3f8-fb3c-4069-99ab-fb6869d02d9d",
      "3159f4ec-2dd4-465b-8b40-ca8056af7a0e/updated": "da89bfea-1d18-4683-84cc-9cea841967ea",
      "b439fc1a-49d9-40df-8754-2faad952375d/modernized": "02f00af9-dfd3-4530-b80d-15bea883daff",
      "b439fc1a-49d9-40df-8754-2faad952375d/original": "29aed913-5e6b-4e93-befb-71a3bcaf74be",
      "3b301c59-f8dd-4029-b650-644b737a70ed/updated": "ab10e49d-a360-42fc-843c-6ab932c0cf2a",
      "0f940360-9aaf-41d1-9601-e8ce60cfd4d7/modernized": "a3c96552-3c2e-433e-84d4-6c3165c339a3",
      "0f940360-9aaf-41d1-9601-e8ce60cfd4d7/original": "67c1d154-4e6e-4850-bb85-2578fc0e12ac",
      "0f940360-9aaf-41d1-9601-e8ce60cfd4d7/updated": "0fd9f95d-7dad-4f81-af1c-e0d5bf5eb286",
      "d70a65d2-a3b6-48d8-8de0-b962aca084bf/updated": "3aa0ae5a-7639-48f7-aea3-4e751c3fc16e",
      "5721d1c1-0c0c-4ac7-96d6-dea095446958/modernized": "93203dc7-032d-4411-b52a-43da81745389",
      "d5d7987d-29a2-4ecb-ab5b-26e355d06a54/modernized": "6291721f-ea92-476e-9516-b34464d64d4c",
      "d5d7987d-29a2-4ecb-ab5b-26e355d06a54/original": "127fa831-0ae3-4d0b-a023-9172864d4a4c",
      "010d8d13-61c7-4485-8ab9-6fcd8297765b/updated": "051224ff-b0bd-418d-aef6-45acca1c5912",
      "6237d678-48f8-44df-9eac-004562987a60/modernized": "61e51619-48f5-4cc7-b771-b976ce7e3fc6",
      "6237d678-48f8-44df-9eac-004562987a60/original": "d6caee7b-07e3-48ff-8992-c72329ccf6c8",
      "b67bb076-0fe3-4959-9ebe-0aa1c7e41b28/modernized": "944e49cb-007a-4dff-9476-1d7786e5a297",
      "b67bb076-0fe3-4959-9ebe-0aa1c7e41b28/original": "6ce3e886-98c6-4c4d-a49c-6aee2dd068ac",
      "032c09e7-d87a-4fa2-95c2-5f2a04c5ee94/modernized": "3e29d0d9-afdb-45be-b523-26b5223d20e0",
      "032c09e7-d87a-4fa2-95c2-5f2a04c5ee94/original": "88cbec8f-f7d2-403c-aba0-fb2ec056eeb0",
      "318ac4f2-08ba-43d1-8d96-80d1714caddc/modernized": "e7508edf-a311-47c7-bc17-423865f186b7",
      "318ac4f2-08ba-43d1-8d96-80d1714caddc/original": "7f97298f-caf6-41e4-ba54-529cc97e040a",
      "3e29db68-80d4-4361-aab2-8be702338705/modernized": "a29d78aa-ffbf-4ab9-b1c0-df2c126e4920",
      "3e29db68-80d4-4361-aab2-8be702338705/original": "d002351f-7b5f-44c0-90fd-f0a849e3de88",
      "2bb79cd9-88c3-4801-ae66-ac70970c97bc/modernized": "8c135378-f87a-4d5b-bc31-0c904951a0b4",
      "2bb79cd9-88c3-4801-ae66-ac70970c97bc/original": "25d59bb0-c99d-463e-8135-0dfc8843966c",
      "b40a8274-196a-43e3-9fef-0c96ab9ce55a/updated": "62339b5a-414e-4b56-9ce3-ccbd70190ea8",
      "54d7505f-a7af-40fd-a21b-33cb6ad5b0a0/modernized": "0404d1e9-20b3-47b3-8e6c-492a5bf7ce20",
      "54d7505f-a7af-40fd-a21b-33cb6ad5b0a0/original": "4d06a3b3-8493-4053-9804-295ba7d1a742",
      "91324cab-b3aa-4b46-abab-703f24a68f95/updated": "70864120-e309-4d3f-ad1a-8b1bb8d813d2",
      "bc710dda-f13a-4208-a8dc-e94fac82dbe6/modernized": "9966af1a-e5ac-4b44-82cb-ed734938fdcc",
      "bc710dda-f13a-4208-a8dc-e94fac82dbe6/original": "4f0c8ca7-af83-4ecb-926f-3ee007c1b2d7",
      "cf6f05e2-e5c9-4ec3-8096-d283f3e4c020/updated": "c21954aa-8960-4f27-b48d-eb8fef3c9fa6",
      "ad348a05-9f91-4f36-90eb-cf5ad94835b1/modernized": "401f1199-c440-4a0b-8d53-4fb93b1cc582",
      "ad348a05-9f91-4f36-90eb-cf5ad94835b1/original": "1a9bc20d-f788-4c94-8eef-69f218feea4e",
      "b74bd655-8907-4484-a3bd-a658b3267dea/modernized": "d94ea6ae-9630-4ce6-a630-80bf48d7ab02",
      "b74bd655-8907-4484-a3bd-a658b3267dea/original": "125cb539-2cf5-4d47-9c2f-11e52ab7569d",
      "af2d9f25-005b-4144-bdac-80bb059700a6/modernized": "362fd9af-726e-4bca-a768-ab79c57d1822",
      "af2d9f25-005b-4144-bdac-80bb059700a6/original": "a88392fc-d4ff-464b-963c-22388a6e10a4",
      "6f47a04b-de86-4646-ba0f-52c7bdbd2ae3/original": "68cd8749-c4df-403f-8aa9-af8345d98878",
      "073e1a75-2193-4b5b-9de1-5a06a8a970e4/original": "36a8709b-9ff8-46c4-8fc6-820a2a3b40e4",
      "d4f97e5f-72fa-4d07-b6c5-21f4712e6f70/original": "20d2ff42-7e58-4474-880d-a7759bad7a42",
      "041de011-afa1-45fb-bf77-9618e4bdb529/original": "90723c70-2358-45b9-909a-85a8e758298d",
      "29b459d6-16ae-4f64-a03c-4ee1794b3523/updated": "1d204716-e253-4c73-966a-0b06ca9c6e9f",
      "0e46ae49-4202-446a-b5c3-06514aa16fa5/modernized": "03495b56-67e5-48f0-8396-9631ebded4f7",
      "0e46ae49-4202-446a-b5c3-06514aa16fa5/original": "afeb18b8-5aba-4bc6-9391-6477ccddd384",
      "0e46ae49-4202-446a-b5c3-06514aa16fa5/updated": "a2f35d0c-dc82-44f3-8bd3-b55437e12e03",
      "1b31482a-5cba-4ab3-b562-462b0a2b4fd3/updated": "c8df62dd-0dcd-428a-ad30-a2e1418eb01d",
      "a3016ba9-1370-4b8c-b680-98f383317f3b/updated": "7f7eb832-c42f-421b-be36-98b706685c26",
      "f93a7eb9-cef7-4b30-81da-7d1a3cd35de2/modernized": "6d42b817-9f17-4ce6-b5ab-21120ca8fb58",
      "f93a7eb9-cef7-4b30-81da-7d1a3cd35de2/original": "6176fed8-e079-4c72-8cb0-4bba205f9e79",
      "5f77b4a4-74e8-4d20-a524-c16e1488ff7d/modernized": "0e0e13be-926d-4b2c-b5df-be87a9ffbfd0",
      "5f77b4a4-74e8-4d20-a524-c16e1488ff7d/original": "96520bed-1a35-4fc9-a8f5-96a659a30a9d",
      "671213db-60a7-42ed-9c07-4785e321de26/modernized": "91cd3db9-3ab1-4f2b-8e46-2083c53e53c3",
      "671213db-60a7-42ed-9c07-4785e321de26/original": "8e944e83-084c-4f62-8bb5-78282a68618b",
      "06d0660f-5f23-4e27-a13d-5c670dbb41e6/modernized": "c231dbea-1c23-4bdc-bb40-782ef3d3125a",
      "06d0660f-5f23-4e27-a13d-5c670dbb41e6/original": "7d7cb5c0-c0a1-462a-b497-c13275433348",
      "470677d5-c6e0-4d1f-a61d-69827d25a14c/updated": "4775267c-74af-4260-9fd0-b7cb2746e219",
      "1e81ab5f-4f72-4570-93a1-e446e1e70267/modernized": "416ade31-58ad-4d03-885c-426c161105c9",
      "1e81ab5f-4f72-4570-93a1-e446e1e70267/original": "5b54dd2b-91a1-476f-a2a6-0f03298d6607",
      "1e81ab5f-4f72-4570-93a1-e446e1e70267/updated": "a4e99e44-3cfc-4260-b33a-677b1e87ab6c",
      "f044dc3e-9e30-41a0-80db-a9af65ff609d/modernized": "5b376497-455a-40a0-a12e-df3714d475b0",
      "f044dc3e-9e30-41a0-80db-a9af65ff609d/original": "368bb2f8-63d8-4637-8f67-13faf3a67d6f",
      "f044dc3e-9e30-41a0-80db-a9af65ff609d/updated": "c6a44e05-81e4-42b1-bb79-9f07aa9104fb",
      "6ee37dca-0b73-4676-aed8-2de0876a0f6b/modernized": "d966d659-a723-4f08-ad22-0e8eba8bac46",
      "6ee37dca-0b73-4676-aed8-2de0876a0f6b/original": "8ca01279-becf-44f0-9853-72307c42c8d6",
      "873dacbb-3205-4afb-8c38-772fb7a09fed/updated": "33c6d3f8-f577-4d6a-8b82-3482c93d6168",
      "3ae687a1-e934-4585-8abd-a477d0cb3b75/original": "8bb02db3-e931-42f5-9183-5efe9691b8f8",
      "609192d0-3eef-4a47-85e8-59d3d2127bbd/modernized": "347dbfa9-7b59-48dc-bbff-bedcc88a3ace",
      "609192d0-3eef-4a47-85e8-59d3d2127bbd/original": "8345d4d1-fdf7-428b-97e7-68774a1de7d0",
      "84ca0ff5-f17c-49ff-9bde-6c9f67a6a352/modernized": "194555af-e1ff-48c6-a2d5-3e8acfe98f56",
      "84ca0ff5-f17c-49ff-9bde-6c9f67a6a352/original": "61646906-e090-4331-9bdf-9cef65a33d52",
      "9ccf1452-3687-4d3e-821a-2caf315092a1/modernized": "97bb26c6-e83e-475c-acc3-b8e65845eb39",
      "9ccf1452-3687-4d3e-821a-2caf315092a1/original": "5be1a4cd-3a8d-48f3-abbb-3e292549eb50",
      "9ec7c639-b4eb-4e58-aa37-fdc23817f5f3/modernized": "a68139a8-9374-4fd5-9bf9-0b4064bac29c",
      "9ec7c639-b4eb-4e58-aa37-fdc23817f5f3/original": "a04691bd-1c01-4fec-ba2b-2f1072b67519",
      "0451a301-8654-42e3-8701-6288579e5bbb/modernized": "4d2eebb8-c1d6-4dc7-94ae-2479ccfcd3df",
      "0451a301-8654-42e3-8701-6288579e5bbb/original": "d6d9ec29-64df-466b-81b0-56f76f7719fc",
      "88220215-a675-4b8c-8762-0dd13d8c649a/modernized": "d22f6461-5957-4eef-b70e-172c04ad8358",
      "88220215-a675-4b8c-8762-0dd13d8c649a/original": "1d785541-3959-4147-b117-3c1028ed651f",
      "20c95c47-62dd-4181-b6e7-dcd8142626ca/modernized": "94154e98-8431-49b1-810c-c65af9b12030",
      "20c95c47-62dd-4181-b6e7-dcd8142626ca/original": "dcf55349-7710-43df-91c4-851da67799dc",
      "b7fb02eb-f804-431a-9c0c-7ead12400bf5/updated": "cff8d640-fe95-43c7-a927-0d9504c4af7e",
      "f9356ff3-a098-45b1-9ed2-022790240c01/updated": "92fd1d66-ad40-4e83-97bb-d16981454e56",
      "57ac3979-2623-4737-8593-5b3cb2d0e1a6/modernized": "146019a9-9199-47f8-a646-64dc283d4f81",
      "57ac3979-2623-4737-8593-5b3cb2d0e1a6/original": "5cb85227-1d0a-4643-a423-428034c622a0",
      "61583c71-4b03-4c37-9bfd-c1ee78d0907e/modernized": "34203179-ce74-48ce-a8f7-b254ec1535da",
      "61583c71-4b03-4c37-9bfd-c1ee78d0907e/original": "02b14b3f-b188-4eec-b6c8-b9465a4c335f",
      "932ed314-b6c2-48c4-b4d8-19ca31d0db49/modernized": "0f83028c-223e-42f7-b5c0-5807154ab4e3",
      "932ed314-b6c2-48c4-b4d8-19ca31d0db49/original": "c362cb57-9657-464b-a360-78e92af4c170",
      "4cd93994-8176-4269-aae3-63eb68fdef28/modernized": "8294fef4-6ba1-41a0-b898-3840b7eb425e",
      "4cd93994-8176-4269-aae3-63eb68fdef28/original": "56de5232-9f69-4b47-8a27-b1896f3222d1",
      "8e66ed6c-5a9f-4842-91c3-4d2b32b02e93/modernized": "d2d45f3a-9551-4d7f-9322-05aeebd3720c",
      "8e66ed6c-5a9f-4842-91c3-4d2b32b02e93/original": "b8865a7e-92a1-4f8a-88b4-32be52f63b40",
      "92d2a0ab-55d5-4fc1-aaf6-f003b172898d/modernized": "2ca1e46b-5e6a-4891-811d-102a86cd9a97",
      "92d2a0ab-55d5-4fc1-aaf6-f003b172898d/original": "24176d1d-d980-4470-8c01-96cc4485808f",
      "a689e647-7065-4bf5-8b50-c4f3b1e73135/modernized": "df3a8fac-b0e7-4e77-90dd-d20bf0694ca4",
      "a689e647-7065-4bf5-8b50-c4f3b1e73135/original": "2c89bcfc-c782-4d45-b714-111845ccd1b1",
      "a689e647-7065-4bf5-8b50-c4f3b1e73135/updated": "91652c41-c0cc-4e5c-8a09-a0eba4d08d32",
      "a64bc50d-4a4c-47ad-9e83-d72bbf5363b7/modernized": "07c47b31-22c7-42a5-8c78-a16b0e36a189",
      "a64bc50d-4a4c-47ad-9e83-d72bbf5363b7/original": "e09eaef4-0b91-4205-9459-f58798ab174f",
      "468770bf-aae5-4c4a-a2b3-41d978f3dd72/modernized": "dd7e6a9b-096c-4a42-84d9-1bbc436efbd4",
      "468770bf-aae5-4c4a-a2b3-41d978f3dd72/original": "5f234533-6e85-453a-9d2e-3b912cf26e3d",
      "53f7cdb3-6c11-47d2-9a5d-0fcd41b5ab57/modernized": "03070eaa-7160-44dd-820a-d0c00dd0aacc",
      "53f7cdb3-6c11-47d2-9a5d-0fcd41b5ab57/original": "5162a349-dbe1-4951-b0d3-9c51893e83f0",
      "9bd10df3-80aa-4623-b66a-61e00f112b47/modernized": "dd7ad034-5ac3-406c-b476-f80cd842e077",
      "9bd10df3-80aa-4623-b66a-61e00f112b47/original": "0b0d08c8-3ad8-4e85-b67a-00c06431986f",
      "88b23e33-bee6-4792-a282-7b7118e818dc/modernized": "3b6bdff1-1824-435e-a80a-ef103a645212",
      "88b23e33-bee6-4792-a282-7b7118e818dc/original": "c2887283-36f6-4b09-9514-373f3868e0d1",
      "67f4202e-ceff-402c-ad33-c1cb530dd247/modernized": "8d048fb2-6ace-4ff5-b5a8-36afa402e294",
      "67f4202e-ceff-402c-ad33-c1cb530dd247/original": "f7fea105-93a2-499f-85cd-0feba43fbf54",
      "c7ef46fd-ed93-471e-971a-32b2e4d8558e/modernized": "a51554a8-8a39-4ae6-8dda-bc8a614fded2",
      "c7ef46fd-ed93-471e-971a-32b2e4d8558e/original": "8f13ea6d-da8f-47ad-9886-8d2284170a04",
      "45dca7c2-3ff9-4a83-acdf-55ec1630cb25/modernized": "37a68f41-6811-4f22-bf63-ff0a2a9827dd",
      "45dca7c2-3ff9-4a83-acdf-55ec1630cb25/original": "76c15514-6ced-4cf5-afde-db418b61a6a3",
      "dfda01ed-36ec-4b37-96fd-9e23b0352fa1/modernized": "5c2f08da-7bda-417b-9a91-a56dc053189f",
      "dfda01ed-36ec-4b37-96fd-9e23b0352fa1/original": "7b107c83-855c-402d-8718-8de8486b7528",
      "dfda01ed-36ec-4b37-96fd-9e23b0352fa1/updated": "33408139-1fd0-4ce1-8e5a-ba203a9548cd",
      "49084c34-f64e-4316-b238-49b7a37e5a8a/modernized": "beb4a884-7fed-4d59-b81a-130d4f71bd3a",
      "49084c34-f64e-4316-b238-49b7a37e5a8a/original": "f5fcbc30-476c-4709-bc08-30a2bcda39e9",
      "a2e8dd81-d87a-4287-b1a6-b67254eb4727/modernized": "be30c645-d8b5-4248-8363-29793fbcd00d",
      "a2e8dd81-d87a-4287-b1a6-b67254eb4727/original": "0528648c-2ce6-4490-9bc7-3481924cc5f8",
      "a8da908c-c9b4-4583-a2a3-ee460a90a4b9/original": "1e65c121-fdd1-4945-a086-73ab70481184",
      "fea5c7ff-bd6f-4c46-b928-c3b4fb1a04e6/updated": "28377c01-a277-406c-8b20-514cf87ec307",
      "a0aa67e3-e96e-44ea-a90c-db739d54eba6/updated": "3f9cf358-1301-4672-8ba2-9c04a2827679",
      "f869e6e5-c5a2-4bdf-96bb-1c4dc13dad2f/updated": "7562ed9b-f77e-422c-acb3-3de9474b966e",
      "2460c682-7d5d-408b-b059-e05e28a19aea/modernized": "02e32520-b022-4611-b240-c128a9021d47",
      "2460c682-7d5d-408b-b059-e05e28a19aea/original": "bd2f2f2a-698d-406d-b377-b3ddc4ff032d",
      "2460c682-7d5d-408b-b059-e05e28a19aea/updated": "755a6e37-9c80-470f-90e6-8d9afd9d7425",
      "51303b80-b6c1-4d45-a740-bf3eaf0767e4/modernized": "eae8a5dd-a826-4c3e-8338-881b997c04a6",
      "51303b80-b6c1-4d45-a740-bf3eaf0767e4/original": "0f2df055-abcd-4318-8ca5-d9cb5176b3e3",
      "99ecfc4d-8a51-411d-805e-f5243d4879ed/modernized": "539ec474-ccc4-42fb-916c-c56548b82899",
      "99ecfc4d-8a51-411d-805e-f5243d4879ed/original": "37920462-29ba-4e12-aabb-4cf2d8f1efda",
      "99ecfc4d-8a51-411d-805e-f5243d4879ed/updated": "e825df4a-8791-42b6-b145-58ad28bd57b8",
      "53f21a86-f264-460f-b879-3cd4a7ddf615/modernized": "6796e497-a073-42d7-a2b0-a581bacce470",
      "53f21a86-f264-460f-b879-3cd4a7ddf615/original": "23643906-7d9a-4f08-858c-24b2fca570ad",
      "c3428a4c-4a2f-480b-8612-f96e104914dd/modernized": "527a6e35-51c3-4d15-924e-c6fee34f50d0",
      "c3428a4c-4a2f-480b-8612-f96e104914dd/original": "622ab37f-2c7f-41a1-9204-f963b8227973",
      "d230b8ce-a185-42b5-bdf1-cf54130e2764/modernized": "1c5dd768-88b9-4714-bbe2-4ec7f2d9d8c4",
      "d230b8ce-a185-42b5-bdf1-cf54130e2764/original": "71fe4786-74b6-49b3-b0da-2722d9cac611",
      "d230b8ce-a185-42b5-bdf1-cf54130e2764/updated": "1e02e4ed-317d-4f3a-b70b-94340122e6c0",
      "d106a18d-6092-4628-a1ec-822f68127743/modernized": "00f281a5-a856-47e0-905e-fe25b79ba478",
      "d106a18d-6092-4628-a1ec-822f68127743/original": "08ac018d-fa12-445e-8a2a-f0f53233ee22",
      "61e7cf9c-a688-4003-be35-e574a750ec10/modernized": "f81568a8-b53b-45b7-bf37-078ef7064d6e",
      "61e7cf9c-a688-4003-be35-e574a750ec10/original": "a6d68dfa-0a4e-4691-8ebf-3d96b51aedfa",
      "00e872a0-b65e-4bd8-92d7-71ffb3a17d91/modernized": "3392d874-1cdf-416f-acee-e180408fd0d6",
      "00e872a0-b65e-4bd8-92d7-71ffb3a17d91/original": "16a65754-6cd9-4774-b9ef-90a4ffc97f53",
      "8b8604f4-042c-46b9-bdf6-a3ad6921164a/modernized": "9c09ce47-4b59-4fde-806f-c854ce125f4a",
      "8b8604f4-042c-46b9-bdf6-a3ad6921164a/original": "e4e3a3d6-ea24-4145-890e-52adf22560d1",
      "2e80b149-e111-4c8c-ab7a-c5e1ed3861f4/modernized": "3eb6fa2c-d0a8-4289-8721-4c3573cf21dd",
      "2e80b149-e111-4c8c-ab7a-c5e1ed3861f4/original": "d06061f0-755b-4df4-a8ed-5a4025d93ea2",
      "0d7bb9f8-b098-4dbd-9780-b32805b43e96/updated": "fa1b7997-ea1c-45d7-832f-6a57f152c712",
      "2eb862e1-cc3e-4588-a504-98db07a85474/updated": "168b1df5-3bf0-4d89-aa18-a06308e8e68c",
      "b63ebb27-7aff-4795-ba5b-fd7f2dfe933e/modernized": "72f36858-0266-49e0-b39d-2c620179dfcd",
      "b63ebb27-7aff-4795-ba5b-fd7f2dfe933e/original": "1cff9ad0-8a13-4309-9068-a533919289c0",
      "acde1806-f0f7-4ed7-a430-b0c8834bc366/modernized": "98c57d25-3587-4778-8d13-f6e01b3a351b",
      "acde1806-f0f7-4ed7-a430-b0c8834bc366/original": "5a32ab8a-a24a-46a4-adb4-50105f3163d2",
      "2ff4c475-b7a6-411f-a960-75edf4bb79fd/modernized": "45aa823a-a8f8-4160-b9b4-0dbd6ec32514",
      "2ff4c475-b7a6-411f-a960-75edf4bb79fd/original": "75edfd8f-d3e8-43f0-8ba9-c155bc29cd34",
      "c960e64d-3daf-410d-b028-cbf3d2cb1f77/modernized": "b3d1578c-13a3-4703-8f9b-885548bdffbe",
      "c960e64d-3daf-410d-b028-cbf3d2cb1f77/original": "0b0ff7cc-0b88-4f09-ac62-3f2ad85833ef",
      "0af1efec-461d-4936-bf91-cc0f44a60bd9/modernized": "bb16ab6e-bd57-44c2-9049-172c2f9d8b54",
      "0af1efec-461d-4936-bf91-cc0f44a60bd9/original": "ccc42020-c0b1-4587-9ff0-70bd878a102d",
      "9511ab72-9a2e-4c6e-a102-1f46aebbd348/modernized": "a78167a2-7e59-4b65-a5f5-df4fa15e3600",
      "9511ab72-9a2e-4c6e-a102-1f46aebbd348/original": "382a699e-5a42-4fa4-800e-e0f22afbc80b",
      "659d4885-daa3-42e1-acc4-827ec5cd0d36/updated": "13477448-813a-47ac-9bfe-bedfc2dcccc6",
      "62e5131b-33a2-425e-8d33-e912b2b9f0ca/modernized": "e413557e-7eef-4e52-b557-23ab263d7eed",
      "62e5131b-33a2-425e-8d33-e912b2b9f0ca/original": "a60c09cb-4211-418f-8282-f17ef5906cb1",
      "dcc2ccc5-0fdb-4dd1-8783-5363bb0b0c27/modernized": "3a70384a-c9c9-4f05-880a-00a8a38c2ff2",
      "91c346f7-2909-4aca-8987-a96cc41683d1/modernized": "2510377b-4245-4ed3-bba4-75a2294b7ad4",
      "9acb6df3-765e-47bd-b50c-bab6b3cd7239/modernized": "39ee4681-da37-4c9e-860b-989b39c51410",
      "9acb6df3-765e-47bd-b50c-bab6b3cd7239/original": "74b9d6cc-e442-4838-abc8-3a5e55f2e177",
      "3d5dd1fa-ae0c-49fd-9b28-21eb91abe1c7/updated": "51e7b007-52e8-48c3-9b09-f531af386540",
      "bce132e2-5ff8-4b5d-b225-e7195cbdb4f3/modernized": "04602bff-bcf8-41e7-96a5-d12091921b48",
      "bce132e2-5ff8-4b5d-b225-e7195cbdb4f3/original": "2f81013e-a0d2-4d97-99ab-a22c96b9eb12",
      "f4781480-fa53-41b6-bdb0-fdecb16089c0/modernized": "056ff773-25b8-47c8-af38-18ba163ecea6",
      "f4781480-fa53-41b6-bdb0-fdecb16089c0/original": "0dfaec32-803c-4c39-8056-c97c6760d890",
      "e1f74ba8-b391-4c4e-a77e-f9fcdb6fd8ff/modernized": "dbcfd8f0-3ff3-4d8c-9b5f-83ae33bbab5e",
      "e1f74ba8-b391-4c4e-a77e-f9fcdb6fd8ff/original": "a474be10-5985-40cb-be8e-08bc81f8f3f9",
      "b61fceff-a434-43f4-9443-342a9137202e/modernized": "60dadefd-0b2a-4f28-964a-e3ca57f5a16d",
      "b61fceff-a434-43f4-9443-342a9137202e/original": "19506bf7-a353-446b-978c-ec331cf9d780",
      "02742c56-b5af-491b-a1bf-ea1e1fc65bdf/modernized": "ba28ea5f-75d1-4c4d-becf-302fce96aeec",
      "02742c56-b5af-491b-a1bf-ea1e1fc65bdf/original": "d6f0688e-b108-4b34-a1a2-9e103452e69c",
      "bd22a3f4-51e1-45a5-9b65-2f0b21bde039/modernized": "1634576f-227c-4108-a8e0-e96f7774041f",
      "96e169c3-ab19-4e1a-bc1b-0b3f44de73be/updated": "fc3e20f1-6af2-4522-a970-b9e7aa383a5d",
      "6d4a1bc7-b97e-4ad6-b55a-ddb7cec564ec/original": "d029e5ca-5397-4c23-be1c-40f906c9a7e0",
      "30ef0a6f-1840-4e66-bb1a-563d1cca1db1/modernized": "7aad4c7c-b75f-4239-8b22-4572f2cfab1b",
      "30ef0a6f-1840-4e66-bb1a-563d1cca1db1/original": "2b1e4543-a59d-487b-aa66-b1bbdbe6e213",
      "a3c29af3-f14e-47da-b290-2548e09ae1d4/original": "f1ff626b-a043-457d-9a88-1e4104486d07",
      "53561891-6761-41b8-b5f8-a1ed91e5dde8/updated": "d3639ec6-618d-4359-8b62-f64e40033ffe",
      "a1b1457c-3678-4659-916d-c7b66e465b7e/updated": "a79e4a67-0125-411f-9032-083082bf1132",
      "7fb96085-7cc6-47df-8fdd-53b100d1ffe7/modernized": "7d99e5e1-7ca1-4f6a-8a02-26c7a058e1ed",
      "7fb96085-7cc6-47df-8fdd-53b100d1ffe7/original": "8fc3e7b6-d2e6-496f-91d7-8d1a9261d56c",
      "25755480-7f1c-4f7f-8900-3f472001fae4/modernized": "78e76249-18e1-4900-9524-be84aef42664",
      "25755480-7f1c-4f7f-8900-3f472001fae4/original": "f7ce1d67-677d-49e6-b84a-cc29398a9c73",
      "69c5fc26-76e3-4302-964e-ba46d889003b/original": "52b54264-2fc1-4d97-928b-19d45cd62ac7",
      "5eae7905-1c99-45ba-8ecd-ffd1cba8be47/updated": "e881ece5-cb03-42ae-bd1b-9239d4ac7c56",
      "0e8bb936-8929-4495-90ea-8f8c8d81544d/updated": "0682eae3-bdcd-4b79-9566-359b44361629",
      "4c88539f-f168-4972-89d7-be945dc62863/updated": "f54679fa-a19b-42a0-b5ff-ee4f50fae969",
      "314bb746-3449-4e69-aacd-8bae50fe92a1/updated": "0d6c08cb-9695-4c20-9dad-8cc42131e1d7",
      "110bb5b7-267e-4d70-9b4d-64b6e46729f2/updated": "e4de85bd-5382-45e6-8433-7c651bef34ff",
      "3a4567fd-c9b3-47f9-82aa-cebd539caaaa/updated": "d1557e59-0511-4bc9-9fee-02222239fae1",
      "b0dacd28-1f1c-4f89-ba0f-fc562c3566d8/updated": "dc493ebc-feef-44c6-8e74-c743fefb7726",
      "bb2e6fb5-156a-4b24-b5aa-f1deefccb5b2/updated": "93c9b807-d1f5-4b7a-97de-2da4234457ba",
      "3358b507-cb00-4121-8f85-2ba75b896bb9/updated": "75d98617-9848-4195-a5e9-88855aeaa969",
      "fa42e9c6-b5d9-4c74-aea7-3816efb8bd2e/updated": "daf583bd-0eea-4c92-8de0-82a47aeb8f8e",
      "6ca63604-3364-4098-a604-190e5d0b0d9e/updated": "d9f18a0d-4a6d-44e5-9dfc-582f7b49c8bc",
      "78ec9b39-f599-4842-b843-b02080972349/updated": "4d7fbb55-f529-4927-bfda-3c08800df929",
      "5230bd9c-e096-4697-8664-a6eb379836f2/updated": "7aea368a-4d45-44fd-95a6-be7d4da9b2a1",
      "4146cfca-8664-44a9-9969-edcf8c8c77cf/updated": "c0fe47c8-6c65-4045-9807-5b022628f7cd",
      "d817ab14-ce02-434e-83a4-f8a142e0affd/updated": "0bdcf146-4c99-4331-aebe-bcbdfa748389",
      "8894463d-1a61-4d04-8c5a-2ea4ce3ca8eb/updated": "516b1a4e-5098-417c-8ce3-64d4ba4a59e5",
      "d4582fa7-f570-443d-bc76-856277696f3d/updated": "872781fd-b29a-4719-ac6b-5ebacbe87315",
      "02f425a0-aca5-4a17-9a24-4b28c9640b41/updated": "ee7b9dd7-1eb1-48d3-91f8-aedc21cfac97",
      "d588963b-e583-4023-abad-b7c526315451/updated": "4e959365-29a2-4127-8bc8-6a7c128ec77d",
      "003f07e3-3930-4f58-a6dd-5fb9fa6e765a/updated": "f1be2db6-2d96-4c5d-9da1-fb62b3e86b39",
      "8fbadbad-0fc1-4dfa-9fb4-d96e7c00ff58/updated": "b4611dbe-bb67-4464-ae06-a3f92d2424cd",
      "2ec53b58-f539-4311-8d09-bf3f28c14a8b/updated": "be98fbc9-bfc3-441f-93cd-c5eab0f32221",
      "d3a7084f-5f52-441c-9088-55f86ae5fb19/updated": "42a72de0-e500-4bb8-aa8c-1fc3f48714bb",
      "6cb39a45-8ba6-4ea2-a248-872a4bd75d19/updated": "41bf2a6f-ef64-458a-9b45-56be2925e957",
      "2dee903b-4a9a-4dae-a9d3-d7937029471a/updated": "4d0c2da7-45e3-402b-ae49-89481bbe4c72",
      "ee1e556f-0462-49bc-a2e3-7c3924c9fb48/updated": "f8de8726-7e65-4435-95c5-766c6235cd66",
      "55d322b1-0e53-4281-9c7b-cf50547d8221/updated": "049a5616-14e1-43fd-b76d-607d56f0a028",
      "8b902ddb-8a70-414a-a6e5-1a815dd6d2e9/updated": "db494f81-70bb-4473-8674-1926b87039a1",
      "45b75dca-02cb-46ff-adf3-b08d0f044dad/updated": "49612475-c738-4ab8-9a8a-43d430ec8539",
      "1314f777-2b9e-40b4-b148-18e64278557a/updated": "1fba354b-fddb-42dc-a706-1f76296ba921",
      "398c7f5a-3fa4-4a29-a275-a0f33920ce08/updated": "118ee712-f10e-4cf5-978a-4cd69ac75c48",
      "9a0ac9a9-9111-4ff8-b416-4b26adc64a87/updated": "9504e85d-7aa2-4b97-a6af-9f05ffbeb283",
      "1a7c0e85-250c-43c9-adbd-0b98972fb9d3/updated": "39006457-7faa-4f76-b11a-9fa37d02a4cd",
      "bf004555-1175-4cd4-8bcb-d5954e2efa4e/updated": "33e8efaf-634f-46e9-95f7-bb59ecc40c43",
      "947049d8-78f9-4f8b-9b5a-56413b3fe60a/updated": "c4dad648-3af7-4903-8b1d-f5842024f48c",
      "17d5addc-df02-450b-8fc8-f845292af618/updated": "89f4f373-deb3-45ff-ac1c-f814dc0e78f1",
      "c68cd139-7ed7-49aa-bb20-36434e16f981/updated": "e44faa85-7700-4ef0-b917-5a222c8e08a0",
      "0089dff8-b287-4b8f-9418-543fa4cc6ffb/updated": "0f8025e1-7b42-44f3-8d3d-ea5848acb3a0",
      "da278bff-6921-412d-b518-b249e5855fc1/updated": "1d54a213-e47f-40c4-bbeb-64284fb5def0",
      "41b1ae64-5130-418e-9fea-a004dbdb46d5/updated": "91126a8b-14e0-401c-86fe-f531b10d2143",
      "184123b9-03ca-44aa-9242-50f339d8c711/updated": "93e4f8b5-2f5a-4df0-be47-9c10ae74c4a2",
      "22795d6d-951c-4690-9a2b-a487acf1f784/updated": "40340d87-b66c-49a9-a257-74d15fbbf7d1",
    ]
  }
}
