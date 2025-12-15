/**
 * Script para probar el envío de emails
 * Uso: node scripts/test-email.js [email-destino]
 */

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env' });

async function testEmail(toEmail = 'test@example.com') {
  console.log('Probando configuración de email...\n');

  // Mostrar configuración actual
  console.log('📧 Configuración actual:');
  console.log(`   Host: ${process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io'}`);
  console.log(`   Port: ${process.env.SMTP_PORT || '2525'}`);
  console.log(`   User: ${process.env.SMTP_USER || 'NO_CONFIGURADO'}`);
  console.log(`   From: ${process.env.SMTP_FROM || '"Backlog Pro" <noreply@backlogpro.com>'}`);
  console.log('');

  // Verificar si las credenciales están configuradas
  if (!process.env.SMTP_USER || process.env.SMTP_USER === 'tu-mailtrap-user') {
    console.log('⚠️  ADVERTENCIA: Credenciales de email no configuradas');
    console.log('   Para configurar Mailtrap:');
    console.log('   1. Ve a https://mailtrap.io/inboxes');
    console.log('   2. Crea una cuenta gratuita');
    console.log('   3. Copia las credenciales SMTP a tu .env.local');
    console.log('   4. Actualiza SMTP_USER y SMTP_PASS\n');
  }

  // Crear transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT || '2525'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'NO_CONFIGURADO',
      pass: process.env.SMTP_PASS || 'NO_CONFIGURADO',
    },
  });

  try {
    // Verificar conexión
    console.log('🔍 Verificando conexión SMTP...');
    await transporter.verify();
    console.log('✅ Conexión SMTP exitosa\n');

    // Enviar email de prueba
    console.log(`📤 Enviando email de prueba a: ${toEmail}`);
    
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Backlog Pro Test" <noreply@backlogpro.com>',
      to: toEmail,
      subject: '🧪 Test Email - Backlog Pro',
      text: 'Este es un email de prueba desde Backlog Pro.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #007bff;">🧪 Email de Prueba</h2>
          <p>Este es un email de prueba desde <strong>Backlog Pro</strong>.</p>
          <p>Si recibes este mensaje, la configuración de email está funcionando correctamente.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Enviado el: ${new Date().toLocaleString()}<br>
            Configuración: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}
          </p>
        </div>
      `,
    });

    console.log('✅ Email enviado exitosamente!');
    console.log(`   Message ID: ${info.messageId}`);
    
    // Para servicios de testing, mostrar URL de preview si está disponible
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`   Preview URL: ${previewUrl}`);
    }

    console.log('\n🎉 ¡Configuración de email funcionando correctamente!');

  } catch (error) {
    console.error('❌ Error en la configuración de email:');
    console.error(`   ${error instanceof Error ? error.message : error}`);
    
    if (error instanceof Error && 'code' in error && error.code === 'EAUTH') {
      console.log('\n💡 Sugerencias para solucionar problemas de autenticación:');
      console.log('   1. MAILTRAP (Recomendado):');
      console.log('      - Ve a https://mailtrap.io/inboxes');
      console.log('      - Crea cuenta gratuita y obtén credenciales SMTP');
      console.log('      - Actualiza SMTP_USER y SMTP_PASS en .env.local');
      console.log('   2. GMAIL (Alternativa):');
      console.log('      - Usa una "App Password" en lugar de tu contraseña normal');
      console.log('      - Habilita autenticación de 2 factores primero');
    }
    
    process.exit(1);
  }
}

// Obtener email de destino desde argumentos de línea de comandos
const targetEmail = process.argv[2] || 'test@example.com';

testEmail(targetEmail).catch(console.error);