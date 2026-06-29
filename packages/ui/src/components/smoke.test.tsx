import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

// Everything is imported through the package's public boundary — the single
// seam a consuming app uses.
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarFallback,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Progress,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  Skeleton,
  Slider,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../index";

describe("component render-smoke tests (export boundary)", () => {
  it("Input + Label", () => {
    render(
      <div>
        <Label htmlFor="n">Name</Label>
        <Input id="n" placeholder="Type here" />
      </div>,
    );
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Type here")).toBeInTheDocument();
  });

  it("Checkbox / RadioGroup / Switch", () => {
    render(
      <div>
        <Checkbox aria-label="agree" />
        <RadioGroup defaultValue="a">
          <RadioGroupItem value="a" aria-label="a" />
          <RadioGroupItem value="b" aria-label="b" />
        </RadioGroup>
        <Switch aria-label="toggle" />
      </div>,
    );
    expect(screen.getByLabelText("agree")).toBeInTheDocument();
    expect(screen.getByLabelText("toggle")).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });

  it("Slider", () => {
    render(<Slider defaultValue={[40]} max={100} aria-label="vol" />);
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("Select (trigger renders)", () => {
    render(
      <Select>
        <SelectTrigger aria-label="pick">
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="x">X</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByText("Pick one")).toBeInTheDocument();
  });

  it("Card", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent>Body</CardContent>
      </Card>,
    );
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("Tabs", () => {
    render(
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
        <TabsContent value="one">First</TabsContent>
      </Tabs>,
    );
    expect(screen.getByText("First")).toBeInTheDocument();
  });

  it("Separator", () => {
    const { container } = render(<Separator />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("Tooltip (trigger renders)", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover</TooltipTrigger>
          <TooltipContent>Tip</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(screen.getByText("Hover")).toBeInTheDocument();
  });

  it("Sidebar (composed)", () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>,
    );
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("Badge variants", () => {
    render(
      <div>
        <Badge>Default</Badge>
        <Badge variant="destructive">Danger</Badge>
        <Badge variant="success">OK</Badge>
      </div>,
    );
    expect(screen.getByText("Default")).toBeInTheDocument();
    expect(screen.getByText("Danger")).toBeInTheDocument();
  });

  it("Alert", () => {
    render(
      <Alert variant="info">
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Something happened.</AlertDescription>
      </Alert>,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Heads up")).toBeInTheDocument();
  });

  it("Progress / Skeleton / Avatar", () => {
    render(
      <div>
        <Progress value={60} aria-label="loading" />
        <Skeleton className="h-4 w-20" data-testid="sk" />
        <Avatar>
          <AvatarFallback>AS</AvatarFallback>
        </Avatar>
      </div>,
    );
    expect(screen.getByTestId("sk")).toBeInTheDocument();
    expect(screen.getByText("AS")).toBeInTheDocument();
  });
});
