const generateBusinessInitial = (name: string): string => {
    const trimmed = name.trim();

    const words = trimmed
        .split(/\s+/)
        .filter(word => word.length > 0);

    const initials = words
        .map(word => word[0])
        .join("");

    return initials.toUpperCase();
};

export default generateBusinessInitial;