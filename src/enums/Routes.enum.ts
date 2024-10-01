export enum Routes {
  HomePage = "/",
  Login = "/login",
  Equipments = "/equipments",
  EquipmentsNew = "/equipments/new",
  EquipmentsEdit = "/equipments/[id]/edit",
  Equipment = "/equipments/[id]",
  EquipmentConstant = "/equipments/[id]/constants",
  ConsumerUnits = "/consumer-units",
  ConsumerUnit = "/consumer-units/[id]",
  ConsumerUnitNew = "/consumer-units/new",
  ConsumerUnitEdit = "/consumer-units/[id]/edit",
  Concessionaires = "/concessionaires",
  Concessionaire = "/concessionaires/[id]",
  ConcessionaireRates = "/concessionaires/[id]/rates",
  Rates = "/rates",
  Rate = "/rates/[id]",
  RateNew = "/concessionaires/[id]/rates/new",
  RateEdit = "/concessionaires/[id]/rates/[id-rates]/edit",
  ConcessionaireEdit = "/concessionaires/[id]/edit",
  ConcessionaireNew = "/concessionaires/new",
  Users = "/users",
  User = "/users/[id]",
  AdminNew = "/users/new",
  UserEdit = "/users/[id]/edit",
  EditProfile = "/users/[id]/edit/profile",
  ConfirmEmail = "/confirm-email",
  NoPermission = "/no-permission",
  Register = "/register",
  RecoverPasswordByEmail = "/recover-password/email",
  MainPage = ConsumerUnits,
}
