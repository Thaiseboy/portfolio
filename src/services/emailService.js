export class EmailService {
  static async sendEmail(emailData) {
    const apiUrl = process.env.VUE_APP_EMAIL_API_URL || 'https://formspree.io/f/YOUR_FORM_ID';
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: emailData.name,
          email: emailData.email,
          message: emailData.message,
          subject: emailData.subject,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        message: 'Email sent successfully!',
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      return {
        success: false,
        message: 'Failed to send email. Please try again.',
        error: error.message,
      };
    }
  }

  static async sendEmailWithMailto(emailData) {
    try {
      const emailBody = `Name: ${emailData.name}\nEmail: ${emailData.email}\nMessage: ${emailData.message}`;
      const mailtoUrl = `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailBody)}`;
      
      window.location.href = mailtoUrl;
      
      return {
        success: true,
        message: 'Email client opened successfully!',
      };
    } catch (error) {
      console.error('Mailto failed:', error);
      return {
        success: false,
        message: 'Failed to open email client.',
        error: error.message,
      };
    }
  }
}