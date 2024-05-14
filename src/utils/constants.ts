export const customerColumns = [
    {key: 'givenName', label: 'Nom', sortable: true},
    {key: 'familyName1', label: 'Cognom', sortable: true},
    {key: 'phone', label: 'Telèfon', sortable: true},
    {key: 'email', label: 'Email', sortable: true},
    {key: 'docNum', label: 'Numero de document', sortable: true},
    {key: 'action', label: 'Acció', sortable: false}
]
export const customerSearchProps = ['givenName', 'familyName1', 'phone', 'email', 'docNum'];
export const productColumns = [
    {key: 'productName', label: 'Nom Producte', sortable: true},
    {key: 'productTypeName', label: 'Tipus de Producte', sortable: true},
    {key: 'mbSpeed', label: 'Speed (mb)', sortable: true},
    {key: 'gbData', label: 'GB Data', sortable: true},
    {key: 'numeracioTerminal', label: 'Numeració Terminal', sortable: true}
]
export const productSearchProps = ['productName', 'productTypeName', 'mbSpeed', 'gbData', 'numeracioTerminal'];
