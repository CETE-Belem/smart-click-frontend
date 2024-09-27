export interface Rate {
    cod_tarifa: string;
    dt_tarifa: string;
    subgrupo: string;
    valor: number;
    intervalos_tarifas: [
        {
            de: number;
            ate: number;
            valor: number;
            tipo: string;
        }
    ]
}