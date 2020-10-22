export const showSuccessMessage = success => (
    <div className="alert alert-success" 
    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{success}</div>
)
export const showErrorMessage = error => (
    <div className="alert alert-danger" 
    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{error}</div>
)