export const importGoogleFont = (): HTMLLinkElement => {
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=Poppins&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return link;
};
