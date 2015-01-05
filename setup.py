
import os
from setuptools import setup, find_packages


def read(*rnames):
    return open(os.path.join(os.path.dirname(__file__), *rnames)).read()

version = '0.3'

setup(name='plone_hyphenator',
    version=version,
    description="",
    long_description=read('README.md'),
    classifiers=[
        "Environment :: Web Environment",
        "Framework :: Plone",
        "Framework :: Zope2",
        "Operating System :: OS Independent",
        "Programming Language :: Python",
    ],
    keywords='plone',
    author='Enfold Systems, Inc.',
    author_email='info@enfoldsystems.com',
    url='',
    license='',
    packages=find_packages(exclude=['ez_setup']),
    namespace_packages=[],
    include_package_data=True,
    zip_safe=False,
    extras_require=dict(
        test=[
            'Products.PloneTestCase',
        ]
    ),
    install_requires=[
        'setuptools',
        "plone.portlets",
        "plone.app.portlets",
        "plone.app.form>=1.1",
        "plone.i18n",
        'zope.component',
        'zope.formlib',
        'zope.i18nmessageid',
        'zope.interface',
        'zope.schema',
        'Zope2',
    ],
    dependency_links=[
    ],
    entry_points="""
    [z3c.autoinclude.plugin]
    target = plone
    """,
)
