from django.db import IntegrityError
from django.db.models.deletion import ProtectedError
from django.test import TestCase

from core.models import Organization, Unit


class OrganizationUnitModelTests(TestCase):
    def test_unit_is_owned_by_its_organization(self):
        organization = Organization.objects.create(name="Central Operations", slug="central-operations")
        unit = Unit.objects.create(organization=organization, name="Investigations", slug="investigations")

        self.assertEqual(unit.organization_id, organization.id)
        self.assertEqual(list(organization.units.all()), [unit])

    def test_unit_slug_is_unique_within_an_organization(self):
        organization = Organization.objects.create(name="Central Operations", slug="central-operations")
        Unit.objects.create(organization=organization, name="Investigations", slug="investigations")

        with self.assertRaises(IntegrityError):
            Unit.objects.create(organization=organization, name="Duplicate", slug="investigations")

    def test_same_unit_slug_can_exist_in_separate_organizations(self):
        first = Organization.objects.create(name="Central Operations", slug="central-operations")
        second = Organization.objects.create(name="Regional Operations", slug="regional-operations")

        Unit.objects.create(organization=first, name="Investigations", slug="investigations")
        Unit.objects.create(organization=second, name="Investigations", slug="investigations")

        self.assertEqual(Unit.objects.filter(slug="investigations").count(), 2)

    def test_organization_deletion_is_protected_while_units_exist(self):
        organization = Organization.objects.create(name="Central Operations", slug="central-operations")
        Unit.objects.create(organization=organization, name="Investigations", slug="investigations")

        with self.assertRaises(ProtectedError):
            organization.delete()

        self.assertTrue(Organization.objects.filter(pk=organization.pk).exists())
