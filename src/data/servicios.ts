export interface Fila {
    verbo: string;
    resto: string;
    texto: string;
    escena: 's1' | 's2' | 's3';
    foto?: string;
}

// escena: ilustración de reserva (s1 Teide, s2 catedral, s3 ciudad). foto: nombre de archivo en src/assets/photos (opcional)
export const filas: Fila[] = [
    {
        verbo: 'Comprar',
        resto: 'su vivienda',
        texto: 'Le decimos cuánto puede financiar de verdad y negociamos las condiciones con varios bancos.',
        escena: 's2',
    },
    {
        verbo: 'Mejorar',
        resto: 'su hipoteca',
        texto: 'Revisamos su hipoteca actual y negociamos un tipo o una cuota mejores, con su banco u otro.',
        escena: 's3',
    },
    {
        verbo: 'Financiar',
        resto: 'su pyme',
        texto: 'Pólizas, préstamos de inversión, reorganización del pool bancario y comercio exterior.',
        escena: 's1',
    },
    {
        verbo: 'Invertir',
        resto: 'en inmuebles',
        texto: 'Estructuramos la financiación de su inversión, incluso hasta el 100% con garantías adicionales.',
        escena: 's2',
    },
    {
        verbo: 'Buying',
        resto: 'in Tenerife',
        texto: 'Mortgages for non-resident buyers, explained in English from the first call.',
        escena: 's3',
    },
];