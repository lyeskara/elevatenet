import { render, screen } from "@testing-library/react";
import JobPageForSeekers from "./JobPageForSeekers";

test("renders JobPageForSeekers component", () => {
	render(<JobPageForSeekers />);
	const jobPageTitle = screen.getByText(/The JobPageForSeekers page/i);
	expect(jobPageTitle).toBeInTheDocument();
});
