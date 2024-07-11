import { createContext, useContext } from "react"
import { TouchableOpacity, TouchableOpacityProps, Text, TextProps, ActivityIndicator } from "react-native";
import clsx from "clsx";

type Variants = "primary" | "secondary"
type ButtonProps = TouchableOpacityProps & {
    variant?: Variants,
    isLoading?: boolean
}

const ThemeContext = createContext<{ variant?: Variants }>({})

function Button({variant = "primary", children, className, isLoading,...rest}: ButtonProps){
    return (
        <TouchableOpacity 
            className={clsx(
                "h-11 flex-row items-center justify-center rounded-lg gap-2",
                {
                    "bg-lime-300": variant === "primary",
                    "bg-zinc-800": variant === "secondary",
                },
                className
            )}
            activeOpacity={0.7}
            disabled={isLoading}
            {...rest}
        >
            <ThemeContext.Provider value={{variant}}>
                {isLoading ? <ActivityIndicator className="text-lime-950"/> : children}
            </ThemeContext.Provider>
        </TouchableOpacity>
    )
}

function Title({children,...rest}: TextProps){
    const { variant } = useContext(ThemeContext)
    return <Text 
        className={clsx(
            "text-base font-semibold ",
            {
                "text-lime-950": variant === "primary",
                "text-zinc-200": variant === "secondary",
            }
        )}
        {...rest}>
        {children}
    </Text>
}

Button.Title = Title

export { Button }
