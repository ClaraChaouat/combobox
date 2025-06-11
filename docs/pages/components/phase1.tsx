import * as React from 'react';
import BrandingRoot from 'docs/src/modules/branding/BrandingRoot';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
// You can use this dataset for the component
import ComboBox from './ComboBox';

/**
 * You can render this page with:
 * yarn docs:dev && open http://0.0.0.0:3002/components/phase1/
 */
export default function LandingPage() {
  // function slowFetch(query: string): Promise<{ id: number; name: string }[]> {
  //   console.log('slowFetch called with', query); // ← debug log
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       console.log('slowFetch resolving', query); // ← debug log
  //       resolve([
  //         { id: 1, name: `${query.toUpperCase()}-A` },
  //         { id: 2, name: `${query.toUpperCase()}-B` },
  //         { id: 3, name: `${query.toUpperCase()}-C` },
  //       ]);
  //     }, 350000000);
  //   });
  // }
  return (
    <BrandingRoot>
      <Container>
        <Typography component="h1" variant="h2" sx={{ mt: 8 }}>
          First phase
        </Typography>
        <ComboBox />
        {/* <ComboBox fetchSuggestions={slowFetch} /> */}
      </Container>
    </BrandingRoot>
  );
}
