import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuLink,
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'

const Navigation = () => {
    const { isLoggedIn, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <div className="border-b px-8 py-4 flex items-center justify-between">
            <div>
                <NavLink to="/record" className="text-xl font-bold">Overnote</NavLink>
                <p className="text-sm text-muted-foreground">The notetaking app for songwriters</p>
            </div>

            <NavigationMenu>
                <NavigationMenuList>
                    {isLoggedIn ? (
                        <>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <NavLink to="/audio">My Files</NavLink>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <NavLink to="/record">Record</NavLink>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <NavLink to="/projects">Projects</NavLink>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Button variant="ghost" onClick={handleLogout}>Logout</Button>
                            </NavigationMenuItem>
                        </>
                    ) : (
                        <>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <NavLink to="/register">Register</NavLink>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <NavLink to="/login">Login</NavLink>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </>
                    )}
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}

export default Navigation