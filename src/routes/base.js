import React, { Suspense } from 'react';
import omit from 'lodash/omit';
import clone from 'lodash/clone';
import { Spin } from 'oss-ui';
import { Switch, Route } from 'react-router-dom';
import KeepAlive from 'react-activation';

export { Route, Switch };

function containerComponent(props) {
    return <props.component {...omit(props, 'component')} />;
}

export const mapRoutes = (routes, match, props) => (
    <Suspense
        fallback={
            <Spin
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    zIndex: '999',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            />
        }
    >
        {routes.map((r, index) => {
            const route = clone(r);

            if (match) {
                route.path = match.url + route.path;
            }

            return (
                <Route
                    key={index}
                    {...omit(route, 'component', 'routes')}
                    render={(props2) => {
                        const containerProps = {
                            path: route.path,
                            pathname: route.path,
                            component: route.component,
                            routes: route.routes,
                            parentMatch: match,
                            ...props,
                            ...props2,
                        };
                        const componentResult = containerComponent(containerProps);
                        if (route.keepAlive) {
                            return <KeepAlive>{componentResult}</KeepAlive>;
                        }
                        return componentResult;
                    }}
                />
            );
        })}
    </Suspense>
);
