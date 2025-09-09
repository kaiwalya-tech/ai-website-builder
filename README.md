# 🤖 AI Website Builder

An intelligent website builder that generates professional websites using AI. Built with Next.js, TypeScript, and modern web technologies.

![AI Website Builder](https://img.shields.io/badge/AI-Website%20Builder-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0+-38bdf8?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- **🎨 AI-Powered Generation**: Automatically generates complete websites based on business descriptions
- **🎯 Smart Component Creation**: Creates header, hero, about, services, contact, and footer sections
- **✏️ Live Edit Mode**: Edit website content in real-time with an intuitive interface
- **📱 Responsive Design**: Mobile-first responsive designs with Tailwind CSS
- **💾 Download Ready**: Export complete websites as HTML/CSS/JS files
- **🤖 AI Chat Assistant**: Get help and make customizations through AI chat
- **📝 Code Editor**: View and modify generated code directly
- **🎨 Multiple Themes**: Support for light and dark color schemes

## 🚀 Technologies Used

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Lucide Icons
- **AI Integration**: Custom AI API for content generation
- **File Management**: JSZip for website exports
- **Development**: Hot reload, TypeScript support

## 📦 Installation

1. **Clone the repository**

git clone https://github.com/kaiwalya-tech/ai-website-builder.git
cd ai-website-builder


2. **Install dependencies**
npm install


3. **Set up environment variables**
cp .env.example .env.local


Add your environment variables:
NEXT_PUBLIC_API_URL=your_api_url_here
AI_API_KEY=your_ai_api_key_here


4. **Run the development server**
npm run dev


5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Getting Started
1. **Fill out the onboarding form** with your business details
2. **Select features** you want on your website
3. **Choose color scheme** (light/dark)
4. **Wait for AI generation** (3-5 minutes)
5. **Review and customize** your generated website

### Features Overview

#### 🏗️ Website Generation
- Input business description and requirements
- AI analyzes and creates custom components
- Automatic responsive design implementation
- Professional styling with modern UI/UX

#### ✏️ Edit Mode
- **Text Editing**: Edit headings (H1-H6) and paragraphs (P) in real-time
- **Live Preview**: See changes instantly in split-screen view
- **Batch Saving**: Save multiple changes at once
- **Change Tracking**: Visual indicators for modified content

#### 💻 Code Editor
- **Syntax Highlighting**: View generated HTML, CSS, and JavaScript
- **Component Structure**: Organized by website sections
- **Direct Editing**: Modify code directly if needed

#### 🤖 AI Assistant
- **Smart Suggestions**: Get AI-powered recommendations
- **Code Help**: Assistance with customizations
- **Content Ideas**: AI-generated content suggestions

#### 📥 Export Options
- **Complete Package**: Download as organized ZIP file
- **Single File**: Get all-in-one HTML file ready to deploy
- **Component Files**: Access individual component files
- **Deployment Ready**: Optimized for web hosting

## 🛠️ Project Structure

ai-website-builder/
├── src/
│ ├── app/
│ │ ├── api/ # API routes
│ │ ├── builder/ # Main builder page
│ │ └── onboarding/ # User onboarding flow
│ ├── components/
│ │ ├── builder/ # Builder-specific components
│ │ ├── onboarding/ # Onboarding components
│ │ └── ui/ # Reusable UI components
│ └── lib/ # Utility functions
├── generated/ # Generated website files
├── public/ # Static assets
└── types/ # TypeScript definitions


## 🔧 Development

### Available Scripts

Development
npm run dev # Start development server
npm run build # Build for production
npm run start # Start production server
npm run lint # Run ESLint
npm run type-check # Run TypeScript checks


### Adding New Features

1. **Components**: Add to `src/components/builder/`
2. **API Routes**: Create in `src/app/api/`
3. **Types**: Define in `types/`
4. **Styling**: Use Tailwind classes

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

### Development Guidelines

- Write TypeScript for all new code
- Use Tailwind CSS for styling
- Follow the existing component structure
- Add comments for complex logic
- Test thoroughly before submitting

## 🐛 Known Issues

- Large websites may take longer to generate
- Edit mode works best with H1-H6 and P elements
- Some complex CSS layouts may need manual adjustment

## 📋 Roadmap

- [ ] **Advanced Themes**: More color schemes and layouts
- [ ] **Image Integration**: AI-powered image selection
- [ ] **SEO Optimization**: Built-in SEO best practices
- [ ] **Analytics**: Website performance tracking
- [ ] **Templates**: Pre-built website templates
- [ ] **Multi-language**: Support for multiple languages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for beautiful icons
- **OpenAI** for AI inspiration

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/ai-website-builder/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/ai-website-builder/discussions)
- **Email**: kaiwalyajoshi9@gmail.com

## ⭐ Star History

If you find this project helpful, please consider giving it a star on GitHub!

---

**Built with ❤️ by [Your Name]**

*Generate professional websites in minutes, not hours!*