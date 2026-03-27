import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuLink,
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'

const Navigation = () => {
    const { isLoggedIn, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const MobileLinks = () => isLoggedIn ? (
        <>

            <SheetClose asChild>
                <NavLink to="/record" className="text-lg font-medium hover:underline">Record</NavLink>
            </SheetClose>
            <SheetClose asChild>
                <NavLink to="/audio" className="text-lg font-medium hover:underline">My Files</NavLink>
            </SheetClose>
            <SheetClose asChild>
                <NavLink to="/projects" className="text-lg font-medium hover:underline">Projects</NavLink>
            </SheetClose>
            <SheetClose asChild>
                <NavLink to="/search" className="text-lg font-medium hover:underline">Search</NavLink>
            </SheetClose>
            <Button variant="outline" onClick={handleLogout} className="text-lg font-medium hover:underline text-left">Logout</Button>
        </>
    ) : (
        <>
            <SheetClose asChild>
                <NavLink to="/register" className="text-lg font-medium hover:underline">Register</NavLink>
            </SheetClose>
            <SheetClose asChild>
                <NavLink to="/login" className="text-lg font-medium hover:underline">Login</NavLink>
            </SheetClose>
        </>
    )

    return (
        <nav>
            {/* Desktop */}
            <div className="hidden lg:flex border-b px-8 py-4 items-center justify-between">
                <div>
                    <NavLink to="/" className="text-xl font-bold">Overnote</NavLink>
                    <p className="text-sm text-muted-foreground">Creative notes on the go</p>
                </div>

                <NavigationMenu>
                    <NavigationMenuList>
                        {isLoggedIn ? (
                            <>
                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild>
                                        <NavLink to="/record">Record</NavLink>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild>
                                        <NavLink to="/audio">My Files</NavLink>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild>
                                        <NavLink to="/projects">Projects</NavLink>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild>
                                        <NavLink to="/search">Search</NavLink>
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

            {/* Mobile */}
            <div className="flex lg:hidden border-b px-4 py-4 items-center justify-between">
                <NavLink to="/" className="text-xl font-bold">Overnote</NavLink>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="px-8 pt-12">
                        <div className="flex flex-col gap-6 mt-8">
                            <MobileLinks />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    )
}

export default Navigation