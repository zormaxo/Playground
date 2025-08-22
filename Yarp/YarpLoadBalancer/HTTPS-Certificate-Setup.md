# HTTPS Certificate Setup for YARP Load Balancer

This document explains how to set up HTTPS certificates for the YARP load balancer running in Docker containers.

## Overview

The YARP load balancer requires HTTPS certificates to enable secure connections. We use .NET development certificates for local development, which are self-signed certificates that are trusted locally.

## Certificate Generation Commands

### 1. Generate and Export Development Certificate

```powershell
dotnet dev-certs https -ep $env:USERPROFILE\.aspnet\https\aspnetapp.pfx -p YarpDevPassword123
```

**What this command does:**
- Creates a development HTTPS certificate for localhost
- Exports it to `C:\Users\{YourUsername}\.aspnet\https\aspnetapp.pfx`
- Protects the certificate file with password `YarpDevPassword123`
- Creates the directory structure if it doesn't exist

**Parameters explained:**
- `dotnet dev-certs https` - .NET CLI certificate management tool
- `-ep` or `--export-path` - Specifies where to save the certificate
- `$env:USERPROFILE` - PowerShell variable for user home directory
- `.pfx` - PKCS#12 format containing both certificate and private key
- `-p` or `--password` - Password to encrypt the certificate file

### 2. Trust the Certificate Locally

```powershell
dotnet dev-certs https --trust
```

**What this command does:**
- Adds the development certificate to your local machine's trusted certificate store
- Prevents browser security warnings when accessing `https://localhost`
- Only affects your local machine - other machines will still see certificate warnings

## Certificate Details

### File Location
```
Windows: C:\Users\{YourUsername}\.aspnet\https\aspnetapp.pfx
Format: PKCS#12 (.pfx)
Password: YarpDevPassword123
```

### Certificate Properties
- **Subject**: CN=localhost
- **Issuer**: CN=localhost (self-signed)
- **Valid for**: localhost, 127.0.0.1, ::1
- **Purpose**: Development only
- **Trust**: Local machine only (after running --trust)

## Docker Integration

The certificate is mounted into the YARP container via Docker Compose:

```yaml
volumes:
  - ${USERPROFILE}\.aspnet\https:/https:ro
```

The container uses these environment variables:
```yaml
environment:
  - ASPNETCORE_Kestrel__Certificates__Default__Path=/https/aspnetapp.pfx
  - ASPNETCORE_Kestrel__Certificates__Default__Password=YarpDevPassword123
```

## Port Configuration

- **Host HTTP**: `http://localhost:5044` → Container port 7070
- **Host HTTPS**: `https://localhost:5443` → Container port 7071
- **HTTP Redirect**: `http://localhost:5044` redirects to `https://localhost:5443`

## Security Considerations

### Development Environment
✅ **Acceptable for local development:**
- Self-signed certificates are standard for local development
- Password-protected certificate files
- Certificates are locally trusted

### Production Environment
❌ **NOT suitable for production:**
- Use real certificates from a Certificate Authority (CA)
- Consider Let's Encrypt for free SSL certificates
- Implement proper certificate rotation and management

## Troubleshooting

### Certificate Not Found
If you get certificate errors, ensure:
1. The certificate file exists at the specified path
2. The password matches in both generation and Docker configuration
3. The certificate hasn't expired

### Trust Issues
If browsers show security warnings:
1. Run `dotnet dev-certs https --trust` again
2. Restart your browser
3. Clear browser cache/SSL state

### Permission Issues
If Docker can't access the certificate:
1. Check file permissions on the certificate directory
2. Ensure Docker has access to the user profile directory
3. Try running Docker as administrator (not recommended for regular use)

## Alternative: Cross-Platform Setup

For cross-platform compatibility (Linux/macOS), use:

```bash
# Linux/macOS
dotnet dev-certs https -ep ${HOME}/.aspnet/https/aspnetapp.pfx -p YarpDevPassword123
dotnet dev-certs https --trust
```

Update docker-compose.yml volume mount accordingly:
```yaml
volumes:
  - ${HOME}/.aspnet/https:/https:ro
```

## Verification

After setup, verify HTTPS is working:

```bash
# Test HTTPS directly
curl -k https://localhost:5443/health

# Test HTTP to HTTPS redirect
curl -v http://localhost:5044/health
```

Expected redirect response:
```
HTTP/1.1 307 Temporary Redirect
Location: https://localhost:5443/health
```

## Certificate Renewal

Development certificates expire after a period. To renew:

1. Delete existing certificate: `dotnet dev-certs https --clean`
2. Generate new certificate: `dotnet dev-certs https -ep $env:USERPROFILE\.aspnet\https\aspnetapp.pfx -p YarpDevPassword123`
3. Trust new certificate: `dotnet dev-certs https --trust`
4. Restart Docker containers: `docker-compose restart`
