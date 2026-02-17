$env:GEMINI_API_KEY = Get-Content .env | Select-String "GEMINI_API_KEY" | ForEach-Object { $_.ToString().Split('=')[1].Trim() }
$url = "https://generativelanguage.googleapis.com/v1beta/models?key=$($env:GEMINI_API_KEY)"

Write-Host "Listing models from: $url"
try {
    $response = Invoke-RestMethod -Uri $url -Method Get
    Write-Host "SUCCESS! Available models:"
    $response.models | ForEach-Object { Write-Host $_.name }
} catch {
    Write-Host "FAILED!"
    $_.Exception.Response.StatusCode.value__
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $reader.ReadToEnd()
}
