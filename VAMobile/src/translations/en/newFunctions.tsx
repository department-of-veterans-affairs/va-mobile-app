type newFunctions = {
    downtimeMessage: (featureName: string, endTime: Date) => string;
    editing: (text: string) => string;
    error: (error: string) => string;
    filled: (value: string) => string;
}


export const englishFunctions: newFunctions = {
    downtimeMessage: downtimeMessage,
    editing: editing,
    error: error,
    filled: filled,
}

function downtimeMessage(featureName: string, endTime: Date)
{
    return featureName + " on V\ufeffA mobile app is currently unavailable. We’re working to fix this. We intend to restore this by " + endTime + ". Please check back soon.";
}

function editing(text: string)
{
    return "Editing: " + text;
}

function error(error: string)
{
    return "Error - " + error;
}

function filled(value: string)
{
    return "Filled - " + value;
}