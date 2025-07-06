export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  OpenBoard: undefined;
  MyLoads: undefined;
  Active: undefined;
  Delivered: undefined;
  Account: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  LoadDetails: { loadId: string };
  FilterLoads: undefined;
};

export type MyLoadsStackParamList = {
  MyLoadsScreen: undefined;
  LoadDetails: { loadId: string };
  BookDetails: { loadId: string };
};

export type BookStackParamList = {
  BookScreen: undefined;
  BookDetails: { loadId: string };
};

export type AccountStackParamList = {
  AccountScreen: undefined;
  Settings: undefined;
  Profile: undefined;
}; 